import React from 'react';

import {Container} from "@material-ui/core"
import {Header} from "./components/Header";
import {Main} from "./containers/Main"
function App(){
  return (
   <Container>
       <Header/>
       <Main/>
   </Container>
  );
}


export default App;