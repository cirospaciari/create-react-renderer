import React from 'react';
import { Link } from 'react-router-dom';

export default function Home({ is_server, is_fetching, model }) {

    return (<>
        <p>
            Edit <code>src/Home.js</code> and save to reload.
        </p>
        <p>
            Or <Link className="App-link" to="/errors">Click here</Link> to test 404 error page ;)
        </p>
        <p data-ssr="ignore">
            You can use data-ssr="ignore" attributes to avoid displaying sensitive data on SSR for caching
            and display this information only after React.hydrate 
        </p>
    </>)
}

export async function fetch(request, reply){

     //code here will be pre-fetched for SSR or navegation
    //Ex: return await axios.get('/api/home', { baseURL: request.origin });
    //you can also use the data fetched in entry point/App.js
    //Ex: const masterPage = await request.entry;

    return {}
}

export function helmet({ model }) {
    //you can use the model for dynamic set your meta tags, title, json+ld etc
    return (
      <title>
        Home Title :D
      </title>
    );
  }