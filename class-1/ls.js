import chalk from 'chalk'
import fs from 'node:fs/promises'
import path from 'node:path'
const folder = process.argv[2] ?? '.'

export default async function ls () {
  let files
  try {
    files = await fs.readdir(folder)
  } catch (err) {
    console.log('Hubo un gran error', err)
    process.exit(1)
  }

  const filePromises = files.map(async file => {
    const filePath = path.join(folder, file)
    let stat
    try {
      stat = await fs.stat(filePath)
    } catch (err) {
      console.log(`No pudo leer el archivo: ${filePath}`)
      process.exit(1)
    }

    const type = stat.isDirectory() ? 'd' : 'f'
    const fileSize = (stat.size / 1024) + ' MB'

    return `${chalk.blue(type)} ${chalk.hex('#fff')(file.padEnd(50))} ${chalk.yellow(fileSize)}`
  })

  const filesInfo = await Promise.all(filePromises)

  filesInfo.forEach(file => console.log(file))
}

ls()
