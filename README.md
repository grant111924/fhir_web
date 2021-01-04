
## Installation & Usage

    git clone https://github.com/grant111924/rce_router.git

    cd fhir_web

    npm install            
    
    npm run buildDev        // for development
    // OR
    npm run buildProd      //  for production  => not yet  
    
    npm start               // navigate to localhost:8080 for local dev



## Boot start up 
    
    sudo npm install pm2 -g // if did not install pm2
    
    pm2 start ./dist/server.js

    pm2 save 