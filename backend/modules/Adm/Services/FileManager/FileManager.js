const fs = require('fs-extra');
const Helpers = use('Helpers')
const paths = require('path');
const mv = require('mv');

const config = require(paths.join(Helpers.appRoot(), "public/admin/filemanager/config/filemanager.config.json"));
const Env = use('Env')

class FileManager {
  async parsePath(path) {
    return new Promise(resolve => {
      const parsedPath = this.parseNewPath(path);
      fs.stat(parsedPath.osFullPath, (err, stats) => {
        if (err) {
          resolve(err);
        } else if (stats.isDirectory()) {
          parsedPath.isDirectory = true;
          parsedPath.stats = stats;
          resolve(parsedPath);
        } else if (stats.isFile()) {
          parsedPath.isDirectory = false;
          parsedPath.stats = stats;
          resolve(parsedPath);
        } else {
          resolve(err);
        }
      });
    });
  }

  parseNewPath(inputPath) {
    let path = inputPath;
    console.log(path)
    const parsedPath = {};
    const fileRoot = config.options.fileRoot || '';
    parsedPath.uiPath = path;

    if (path.substring(0, fileRoot.length) !== fileRoot) {
      path = paths.posix.join(fileRoot, path);
    }

    parsedPath.relativePath = paths.posix.normalize(path);
    parsedPath.filename = paths.posix.basename(parsedPath.relativePath);
    parsedPath.osRelativePath = paths.normalize(path);
    parsedPath.osExecutionPath = Env.get('FILEMANAGER_ROOT');
    parsedPath.osFullPath = paths.join(parsedPath.osExecutionPath, parsedPath.osRelativePath);
    parsedPath.osFullDirectory = paths.parse(parsedPath.osFullPath).dir;
    return parsedPath;
  }

  async readfolder(pp) {
    return new Promise(resolve => {
      fs.readdir(pp.osFullPath, async (err, files) => {
        if (err) {
          console.log('err -> ', err);
          resolve(err);
        } else {
          const loopInfo = {
            results: [],
            total: files.length,
          };

          if (loopInfo.total === 0) {
            resolve(loopInfo.results);
          }

          const infoList = []
          for (let i = 0; i < files.length; i++) {
            const info = await this.getIndividualFileInfo(pp, files[i])
            infoList.push(info);
          }
          resolve(infoList);
        }
      });
    })

  }

  async getIndividualFileInfo(pp, file) {
    const ipp = await this.parsePath(paths.posix.join(pp.uiPath, file))
    const info = this.getinfo(ipp)
    return info;
  }

  async getinfo(pp) {
    if (pp.isDirectory) {
      return this.directoryInfo(pp);
    } else {
      return this.fileInfo(pp);
    }
  }

  directoryInfo(pp) {
    const result = {
      id: pp.uiPath.replace(/([\s\S^/])\/?$/, '$1/'),
      type: 'folder',
      attributes: {
        created: pp.stats.birthtime,
        modified: pp.stats.mtime,
        name: pp.filename,
        path: pp.uiPath.replace(/([\s\S^/])\/?$/, '$1/'),
        readable: 1,
        writable: 1,
        timestamp: '',
      },
    };
    return result;
  }

  fileInfo(pp) {
    const result = {
      id: pp.uiPath,
      type: 'file',
      attributes: {
        created: pp.stats.birthtime,
        modified: pp.stats.mtime,
        name: pp.filename,
        path: pp.uiPath,
        readable: 1,
        writable: 1,
        timestamp: '',
      },
    };
    return result;
  }

  addfolder(pp, name) {
    return new Promise(resolve => {
      fs.mkdir(paths.join(pp.osFullPath, name), (err) => {
        if (err) {
          resolve(err);
        } else {
          const result = {
            id: `${pp.relativePath}${name}/`,
            type: 'folder',
            attributes: {
              name,
              created: pp.stats.birthtime,
              modified: pp.stats.mtime,
              path: `${pp.relativePath}${name}/`,
              readable: 1,
              writable: 1,
              timestamp: '',
            },
          };
          resolve(result);
        }
      });
    });
  }

  async deleteItem(pp) {
    return new Promise(resolve => {
      if (pp.isDirectory === true) {
        fs.rmdir(pp.osFullPath, (err) => {
          if (err) {
            resolve(err);
          } else {
            resolve(this.directoryInfo(pp));
          }
        });
      } else {
        fs.unlink(pp.osFullPath, (err) => {
          if (err) {
            resolve(err);
          } else {
            resolve(this.fileInfo(pp));
          }
        });
      }
    })
  }

  async rename(old, newish) {
    console.log(old, newish)
    return new Promise(resolve => {
      fs.rename(old.osFullPath, newish.osFullPath, (err) => {
        if (err) {
          resolve(err);
        } else {
          const name = paths.parse(newish.osFullPath).base;

          const result = {
            id: `${newish.relativePath}`,
            type: old.isDirectory === true ? 'folder' : 'file',
            attributes: {
              name,
              created: '',
              modified: '',
              path: `${newish.relativePath}`,
              readable: 1,
              writable: 1,
              timestamp: '',
            },
          };
          resolve(result);
        }
      });
    })
  }

  async copy(source, target, callback) {
    return new Promise(resolve => {
      fs.readFile(source.osFullPath, (err, file) => {

        if (err) {
          resolve(err);
          return;
        }
        fs.writeFile(target.osFullPath, file, (error) => {

          if (error) {
            resolve(error);
            return;
          }
          const name = paths.parse(target.osFullPath)
            .base;
          const result = {
            id: `${target.relativePath}`,
            type: 'file',
            attributes: {
              name,
              created: '',
              modified: '',
              path: `${target.relativePath}`,
              readable: 1,
              writable: 1,
              timestamp: '',
            },
          };
          resolve(result);
        });
      });

    })
  }

  async savefiles(pp, files) {
    return new Promise(async (resolve) => {
      const loopInfo = {
        results: [],
        total: files.length,
        error: false,
      };

      try{
        const res = await this.renameIndividualFile(pp, files);
        loopInfo.results.push(res);
      }catch(e){
        console.log(e)
        loopInfo.error = e
      }

      // for (let i = 0; i < files.length; i++) {
      //   console.log(999909090)
      //   try{
      //     const res = await renameIndividualFile(pp, files[i]);
      //     loopInfo.results.push(res);
      //   }catch(e){
      //     console.log(e)
      //     loopInfo.error = e
      //   }
      // }
      resolve(loopInfo.results)
    })
  }

  async renameIndividualFile(pp, file) {
    return new Promise((resolve, reject) => {
        const oldfilename = paths.resolve(file.tmpPath);

        const newfilename = paths.join(
          Env.get('FILEMANAGER_ROOT'),
          pp.isDirectory ? pp.relativePath : '',
          pp.isDirectory ? file.clientName : pp.filename
        );

        mv(oldfilename, newfilename, (err) => {
          if (err) {
            reject(err);
            return;
          }
          const name = paths.parse(newfilename).base;

          const result = {
            id: `${pp.relativePath}${name}`,
            type: 'file',
            attributes: {
              name,
              created: pp.stats.birthtime,
              modified: pp.stats.mtime,
              path: `${pp.relativePath}${name}`,
              readable: 1,
              writable: 1,
              timestamp: '',
            },
          };

          resolve(result);
        });

    })
  }

}

module.exports = new FileManager();