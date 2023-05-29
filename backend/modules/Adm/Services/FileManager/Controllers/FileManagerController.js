'use strict'
const fs = require('fs-extra');

const paths = require('path');
const multer = require('multer');
paths.posix = require('path-posix');
const Helpers = use('Helpers')

const config = require(paths.join(Helpers.appRoot(), "public/admin/filemanager/config/filemanager.config.json"));
const upload = multer({ dest: 'public/assets/' });

const FileManager = require(paths.join(__dirname, '../FileManager.js'));

class FileManagerController {
  async get({ request, response, auth, params }) {
    const { mode, path, name } = request.all();
    let pp = null;
    switch (mode.trim()) {
      case 'initiate':
        return {
          data: {
            id: "/",
            type: mode,
            attributes: {
              config: {
                security: config.security,
                upload: config.upload
              }
            }
          }
        };
        break;
      case 'getinfo':
        parsePath(path, (pp) => {
          getinfo(pp, (result) => {
            response.send({
              data: result
            });
          });
        });
        break;
      case 'readfolder':
        pp = await FileManager.parsePath(path);
        const results = await FileManager.readfolder(pp);
        return {
          data: results
        };
        break;
      case 'getimage':
        pp = await FileManager.parsePath(path);
        response.download(paths.resolve(pp.osFullPath));
        break;
      case 'readfile':
        pp = await FileManager.parsePath(path);
        response.download(paths.resolve(pp.osFullPath));
        break;
      case 'download':
        pp = await FileManager.parsePath(path);
        response.header('content-type', 'text/html; charset=UTF-8');
        response.header('content-description', 'File Transfer');
        response.header('content-disposition', 'attachment; filename="' + pp.filename + '"');
        response.download(paths.resolve(pp.osFullPath));
        break;

      case 'addfolder':
        pp = await FileManager.parsePath(path);
        const result = await FileManager.addfolder(pp, name)
        response.send({
          data: result
        });
        break;

      case 'delete':
        pp = await FileManager.parsePath(path);
        response.send({
          data: await FileManager.deleteItem(pp)
        });
        break;

      case 'rename':
        const rename_opp = await FileManager.parsePath(request.all()['old']);
        const newPath = paths.posix.parse(rename_opp.uiPath).dir;
        const newish = paths.posix.join(newPath, request.all()['new']);
        const rename_npp = await FileManager.parseNewPath(newish);
        response.send({
          data: await FileManager.rename(rename_opp, rename_npp)
        });
        break;

      case 'move':
        const move_opp = await FileManager.parsePath(request.all()['old']);
        const move_npp = await FileManager.parseNewPath(paths.posix.join('/', request.all()['new'], move_opp.filename));

        response.send({
          data: await FileManager.rename(move_opp, move_npp)
        });
        break;

      case 'copy':
        const copy_opp = await FileManager.parsePath(request.all()['source']);
        const copy_npp = await FileManager.parseNewPath(paths.posix.join('/', request.all()['target'], copy_opp.filename));

        response.send({
          data: await FileManager.copy(copy_opp, copy_npp)
        });
        break;

      default:
        res.status(404).send('no matching GET route found with mode: \'' + mode.trim() + '\'');
    }
  }


  async post({ request, response, auth, params }) {
    const { mode, path } = request.all();

    let pp = null;
    switch (mode.trim()) {
      case 'upload':
        pp = await FileManager.parsePath(path);
        return {
          data: await FileManager.savefiles(pp, request.file('files'))
        };
        break;

      case 'savefile':
        parsePath(path, (pp) => {
          getinfo(pp, (result) => {
            fs.writeFile(paths.resolve(pp.osFullPath), req.body.content, (error) => {
              if (error) {
                res.status(500)
                  .send(error);
              }
              fs.readFile(paths.resolve(pp.osFullPath), (err, f) => {
                if (err) {
                  res.status(500)
                    .send(err);
                }
                result.attributes.content = f.toString();
                respond({
                  data: result
                });
              });
            });
          }); 
        }); 
        break;
      default:
        console.log("no matching POST route found with mode: '", mode.trim(), '\' query -> ', req.query);
        respond({
          Code: 0
        });
    }
  }
}


module.exports = FileManagerController;
