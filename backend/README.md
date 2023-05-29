# Init project

## Git
Config for free changing permission after clone

```bash
  git config core.fileMode false
```

If you need init `ADM`

```bash
  git submodule update --init
  git submodule update --remote

```
## Clone `.env.example` as `.env` and set your settings
### If you have `make`
####  If you didn`t build docker-container
```bash
  make build
  make ssh
```
####  If you build docker-container
```bash
  make up
  make ssh
```
#### In `web` container
```bash
  adonis key:generate # only if u dont run it before
  adonis adm:init
  adonis migration:run
  adonis seed
  adonis module:sync
```
### If you dont have `make` or `docker`
#### If you dont have global `@adonisjs/cli pm2`
```bash
  npm i -g @adonisjs/cli pm2
```
####  Then

```bash
  npm run pm2-start-dev # or npm run adonis-serve-dev 
  adonis key:generate # only if u dont run it before
  adonis adm:init
  adonis migration:run
  adonis seed
  adonis module:sync
```