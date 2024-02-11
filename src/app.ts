import express, { Application, RequestHandler } from 'express';
import { appDataSource } from './config/dataSource';
import './cronJobs';
import { AppInit } from './interfaces/AppInit.interface';
import { IRoute } from './interfaces/IRoute.interface';
import { errorsHandler } from './middlewares/errorsHandler.middleware';
import swaggerDocs from './swagger/swagger';
class App {
  public app: Application;
  public port: number;
  constructor(appInit: AppInit) {
    this.app = express();
    this.port = appInit.port;

    this.initAssets();
    this.initMiddlewares(appInit.middlewares);
    this.initRoutes(appInit.controllers);
    this.app.use(errorsHandler);
  }
  private initMiddlewares(middlewares: RequestHandler[]) {
    middlewares.forEach((middleware) => {
      this.app.use(middleware);
    });
  }
  private initRoutes(routes: IRoute[]) {
    routes.forEach((route) => {
      this.app.use(route.path, route.router);
    });
  }
  private initAssets() {
    this.app.use(express.json());
    this.app.use(express.static('public'));
  }
  public async listen() {
    await appDataSource.initialize();
    swaggerDocs(this.app, this.port);

    this.app.listen(this.port, () => {
      console.log(`⚡️ Server is listening on port http://localhost:${this.port}`);
    });
    process.on('exit', () => {
      appDataSource.destroy();
    });
  }
}

export default App;
