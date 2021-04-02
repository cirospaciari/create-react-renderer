import React from 'react';
import App, { fetch } from './App.js';

import { lazy } from '@react-renderer/app';

export default function routes(router) {


    router.entry({ component: App, fetch  });
    
    router.add({
        path: '/',
        component: lazy(()=> import('./Home.js'), { fallback: ()=> <div>Loading...</div> })
        // component: App //if you dont want/need code-split support
    });

    //you can use helmet and fetch directly in routes or in export like in Home
    ///you can use lazy to code slit the default page for 404 and 500 errors if yout want :D
    router.add({
        error: 404,
        helmet: ()=> <title>Oops...</title>,
        component: ()=> <div>Not Found</div>
    });
    router.add({
        error: 500,
        helmet: ()=> <title>Oops...</title>,
        component: ()=> <div>Internal Error</div>
    });
}