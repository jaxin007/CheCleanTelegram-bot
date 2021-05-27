import { appPromise } from './index';

appPromise().then(() => console.log('Bot is started')).catch((err) => console.error(err));
