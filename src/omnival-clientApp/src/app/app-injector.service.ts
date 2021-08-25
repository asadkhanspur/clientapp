import { Injector } from '@angular/core';


//Inject Dependency To Base Class or Component
export class AppInjector {

    private static injector: Injector;

    static setInjector(injector: Injector) {

        AppInjector.injector = injector;

    }

    static getInjector(): Injector {

    return AppInjector.injector;

    }

}       