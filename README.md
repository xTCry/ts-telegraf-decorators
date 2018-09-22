# ts-telegraf-decorators
ts-telegraf-decorators

This is a simple library that will allow you to use decorators and typescript. Based on [telegraf](https://github.com/telegraf/telegraf/)

### Installation

```
$ npm install ts-telegraf-decorators 
```

### Base Examples

Create controller
```typescript
import {Start, Command, TFController} from 'ts-telegraf-decorators'

@TFController()
export class ControllerTest {

    @Start()
    start(ctx: any){
        ctx.reply('Hello start')
    }
    
    @Command('ping')
    ping(ctx: any){
        ctx.reply('pong')
    }
}
```

Create app.ts
```typescript
import {buildBot} from "ts-telegraf-decorators";
//import {ControllerTest} from "./controllers/ControllerTest";


buildBot({
    token: process.env.BOT_TOKEN,
    // bot: bot                 bot instance
    // session: session()       custom session
    controllers: [__dirname+'/controllers/**.js'],
    // or controllers: [ControllerTest],
}).startPolling()



```
