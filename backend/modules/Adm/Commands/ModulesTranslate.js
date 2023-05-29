'use strict'

const Config = use('Config')
const path = require('path')
const fs = require('fs')
const translate = require('@iamtraction/google-translate')

const { Command } = require('@adonisjs/ace')

class ModulesTranslate extends Command {
  static get signature() {
    return 'modules:translate'
  }

  static get description() {
    return 'Add translates for existing locales from default language'
  }

  async translate(text, { to }) {
    try {
      return await translate(text, { to })
    } catch (e) {
      console.log(e.message)
      return false
    }
  }

  async handle() {
    const { defaultLocale, locales } = Config.get('admin.general')
    const modulesPath = path.resolve('modules')

    fs.readdirSync(modulesPath, { withFileTypes: true })
      .filter((dir) => dir.isDirectory())
      .forEach(({ name }) => {
        const localesPath = path.join(modulesPath, name, '/resources/locales')
        const defaultLocalePath = path.join(localesPath, defaultLocale)

        fs.readdirSync(defaultLocalePath, { withFileTypes: true })
          .filter((dir) => dir.isFile())
          .forEach(async ({ name }) => {
            for (const locale of locales.filter((l) => l.slug !== defaultLocale)) {
              const localePath = path.join(localesPath, locale.slug)
              if (!fs.existsSync(localePath)) fs.mkdirSync(localePath)

              const translationPath = path.join(localePath, name)
              if (!fs.existsSync(translationPath)) {
                const defaultTranslation = require(path.join(defaultLocalePath, name))
                const defaultSeparator = '|'
                const res = await this.translate(Object.values(defaultTranslation).join(defaultSeparator), { to: locale.slug })
                if (res) {
                  res.text = res.text.split(defaultSeparator)

                  const translation = Object.fromEntries(
                    Object.entries(
                      Object.entries(defaultTranslation)
                    ).map(([i, [key]]) => [key, res.text[i].trim()])
                  )
                  fs.writeFileSync(translationPath, JSON.stringify(translation, null, 2))
                  console.log(`Added new translation by path ${translationPath}`)
                }
              }
            }
          })
      })
  }
}

module.exports = ModulesTranslate
