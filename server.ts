import * as https from 'https';
import * as fs from 'fs';
import app from './app';

const PORT = process.env.PORT || 3000;

https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}, app).listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
