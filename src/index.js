import 'dotenv/config'
import fs from 'fs'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

import { getAdsFromPageId } from './modules/facebookAds/getAdsFromPageId'
import { app } from './utility/express'

let port = process.env.PORT || 7890

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const server = app.listen(port, async () => {
  console.log('👣 Backend :: Server Live on port', port)
  const intercepts = await getAdsFromPageId('116700222203350')
  const adsObject = intercepts.ads
  // console.log('final ads', intercepts.ads)
  
  const filename = 'newDesired.json'
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const filepath = path.join(__dirname, filename)
  const jsonintercepts = JSON.stringify(adsObject)
  console.log(jsonintercepts)
  try{
    fs.writeFileSync(filepath, jsonintercepts)
    console.log('File Saved Successfully')
  }catch(error){
    console.log("Error in file Saving please retry... ", error)
  }

})

const gracefulShutdown = () => {
  server.close(() => {
    // do graceful shutdown here

    console.info('Gracefully Shutting Down.')
    process.exit(0) // if required
  })
}
process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)
process.on('SIGHUP', gracefulShutdown)

process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION', error) // TODO: Check if it's a baaaad one and shut down
  gracefulShutdown()
})
