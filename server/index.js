
const { Router } = require('@react-renderer/router');

const path = require('path');
const fastify = require('fastify')({
    logger: false,
    ignoreTrailingSlash: true // Ex: register /product and /product/
});

//only if you want cookie support
fastify.register(require('fastify-cookie'), {
    secret: "my-secret", // for cookies signature
    parseOptions: {}     // options for parsing cookies
});
//redirect index.html to home
fastify.get('/index.html', async (request, reply)=> reply.redirect('/'));
//static resources
fastify.register(require('fastify-static'), {
    root: path.join(__dirname, '../build/')
});
const router = new Router({

    //inform routes path (can be imported multiple times in forks)
    routes: path.join(__dirname, '../src/routes.js'),

    //React generated HTML File
    html_file: path.join(__dirname, '../build/index.html'),

    //selector to root element (default: #root)
    root_element: '#root', 
    
    //babel configuration (opcional see default configuration in: )
    // babel_config: path.join(__dirname, './babel_config.js'),

    //renderer instances (default: 2)
    instances: 2,

    //use fork process instead of work_threads [default false] 
    use_fork: false, 
    
    //max memory per instance in MB (default: 250)
    max_memory: 250,

    //remove img tags from SSR (client side will load images before) (default: true)
    remove_images: false, 
    // remove_images: 'svg',
    // remove_images: 'svg,img',
    // remove_images: 'img',

    //assets option is only needed if you are not removing image tags from SSRs
    assets: {
        //assets url path for mapping image imports (default: /static/media)
        img_path: '/static/media', //need to match assets-manifest.json files path and need to start with /
        //assets url path for mapping dynamic css imports (default: /static/css)
        css_path: '/static/css', //need to match assets-manifest.json files path and need to start with /
        //if you are using webpack, manifest is required to translate properly the images and css urls
        manifest: path.join(__dirname, '../build/asset-manifest.json') 
    }
});

//types: 'fastify', 'express'
router.register(fastify, 'fastify');

//listen
fastify.listen(process.env.PORT || 3000, process.env.HOST || '127.0.0.1', (err, address) => {
    if (err) throw err;
    console.log(`SSR server listening on ${address}`);
});
