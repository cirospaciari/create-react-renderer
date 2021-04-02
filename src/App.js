import React from 'react';
import logo from './logo.svg';
import './App.scss';

export default function App(props) {
  const { is_server, is_fetching, model } = props;
  //you can check if it's fetching for loading or fallback data
  if(is_fetching)
    return <div>Loading...</div>

  return (
    <div className="App">
      {/*suppressHydrationWarning is need only if you are using lazy for code-split */}
      <header className="App-header" suppressHydrationWarning={true}>
        <img src={logo} className="App-logo" alt="logo" />
        {props.children}
        <a
          className="App-link"
          href={model.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {model.message}
        </a>
      </header>
    </div>
  );
}

export async function fetch(request, reply){
  //code here will be pre-fetched for SSR or navegation
  //Ex: return await axios.get('/api/header_data', { baseURL: request.origin });

  //Mock data just for showing :D
  return  {
    link: 'https://ciro.spaciari.com/react-renderer',
    message: 'Learn more about @react-renderer/router'
  }
}
