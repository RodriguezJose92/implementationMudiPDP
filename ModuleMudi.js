export const experienceMudi = ({

    // Datos del cliente
    numberSku           = null , 
    tokenapi            = null ,
    idCompany           = null , 

    // Datos llenados fetch
    link3D              = null ,
    linkAR              = null ,
    linkQR              = null ,
    linkQRAD            = null ,
    name                = null ,

    // Configuraciones de estilo.
    fatherContainer     = document.body ,
    zindexBTN           = 90 ,
    zindexModal         = 99 ,
    flexDirectionBtns   = 'column',

    // Visibilidad ToolTip
    viewToolTip         = true,
    intervaleTime       = 9000,

}) => {

    // verificaciones de parametros Necesarios
    if(tokenapi === null || numberSku === null || idCompany == null){
        console.error('Los parámetros "tokenapi" "numberSku" "idCompany" deben estar debidamente proporcionados.Porfavor revíselo, si tiene dificultades; consulte al equipo Mudi.')
        return false
    } else if( typeof(intervaleTime) !== 'number'){
        console.error('El parámetro "intervaleTime" recibe únicamente valores de tipo "number"')
        return false
    }

    else{
        
        let Body = {'skus':[numberSku]};
        let bodyString = JSON.stringify(Body);

        fetch('https://mudiview.mudi.com.co:7443/product/getProductsUrl',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'tokenapi' :`${tokenapi}`
            },
            body: bodyString
        })
        .then(data=>data.json())
        .then(data=> data.data.length == 0 ? false : (

            link3D      = data.data[0].URL_WEB,
            linkAR      = data.data[0].URL_AR,
            linkQR      = data.data[0].URL_QR,
            linkQRAD    = data.data[0].URL_QR_ADVANCED,
            name        = data.data[0].NAME,

            createBtns()
        ))
        .catch(e=>console.error(e));
    };
      
    // Condiciones para el QR-ADVANCE! 
    const QRPARAMS = new URLSearchParams(location.search).get('AR') ;
    QRPARAMS === 'true' ? createModal({ type:'AR' }) : false  ;

    // Función inicializadora -- CREAR BOTONES
    function createBtns(){

        let loadBtn = ['false','false']

        const link = document.createElement('LINK');
        // link.href=`https://mudi.com.co/module/mudi/index.css`;
        link.href=`./index.css`;
        link.setAttribute('rel','stylesheet');

        document.head.appendChild(link);
    
        const div = document.createElement('DIV') ; 
        div.classList.add( 'containerBtnsMudi' );

        div.innerHTML = ` 
        <div class="tooltipMudiContainer" style="z-index:${zindexBTN}; flex-direction:${flexDirectionBtns}">
            <img sku="${numberSku}" class="imgBtn3D" id="img3DBtn" src="https://mudi.com.co/cliente/${idCompany}/btn3D.webp" alt="btnMudi3D">
            <img sku="${numberSku}" class="imgBtnAR" id="imgARBtn" src="https://mudi.com.co/cliente/${idCompany}/btnAR.webp" alt="btnMudiAR">   
        </div>
        `; 

        document.addEventListener('keydown',(e)=> document.querySelector('.windowModalMudi') && (e.key == 'Escape' || e.key == 'Backspace') ? document.querySelector('.windowModalMudi').remove() : false
        );

        viewToolTip ? createToolTip(div) : false ;
        
        div.querySelector('.imgBtn3D').addEventListener('click', ()=>createModal({type:'3D'}) , false) ;
        div.querySelector('.imgBtnAR').addEventListener('click', ()=>createModal({type:'AR'}) , false) ;
        
        div.querySelector('.imgBtn3D').addEventListener('load',()=>{
            loadBtn[0]          = 'true';
            if( loadBtn[0]      == 'true' && loadBtn[1]=='true' ){ fatherContainer.appendChild(div) }
        });

        div.querySelector('.imgBtnAR').addEventListener('load',()=>{
            loadBtn[1]='true';
            if(loadBtn[1]=='true' && loadBtn[0]=='true' ){
                fatherContainer.appendChild(div) ;
            }
        });

    } ;

    /* Tooltips */
    function createToolTip(div){
        const p = document.createElement('P');
        p.classList.add('tooltipMudi')
        p.innerHTML=`<b>¡Nuevo!</b> prueba nuestras experiencias de 3D y Realidad Aumentada`;
        div.querySelector('.tooltipMudiContainer').appendChild(p);
        setInterval(()=>hideToolTip(div),intervaleTime)
    }

    function hideToolTip(div){
        div.querySelector('.tooltipMudi').style.opacity=1;
        div.querySelector('.tooltipMudi').style.animation=`hideElements 1s ease-in-out .5s 1 normal forwards`
    }

    /* Create Modals */
    function createModal({type}){

        if(type === '3D') { createModal3D() }
        else if (type === 'AR') { createModalAR() }
        else { console.error('ERROR:MUDI = createModalType undefined') ; return false  }
        
    };

        function createModal3D(){

            const div = document.createElement('DIV') ; 
            div.classList.add('windowModalMudi') ; 
            div.setAttribute('style',`z-index:${zindexModal}`);

            div.innerHTML=`
                <div class="contentModal3D">
                    <img src="https://mudi.com.co/cliente/${idCompany}/closeModal.webp" alt="closeModalMudi" type="image/webp" class="closeModal" width:50px>
                    <h1 class="nameSkuMudi">${name}</h1>
                    <iframe class="iframeMudi3D" src="${link3D}"></iframe>
                    <img class="powerByMudi3D" src="https://mudi.com.co/Assets/SVG/powerByMudi.webp" type="image/webp" alt="Power By Mudi">
                </div>
            `;

            div.querySelector('.powerByMudi3D').addEventListener('click',()=> window.open('https://mudi.com.co','_BLANK'), false) ;
            div.querySelector('.closeModal').addEventListener('click',()=> document.querySelector('.windowModalMudi').remove() , false) ;
            document.body.appendChild(div) ;

            document.querySelector('windowModalMudi').addEventListener('click',()=> document.querySelector('.windowModalMudi').remove() , false );

        };

        function createModalAR(){

            const div = document.createElement('DIV') ; 
            div.classList.add('windowModalMudi') ; 
            div.setAttribute('style',`z-index:${zindexModal}`);

            div.innerHTML=`
                <div class="contentModalAR">
                    <img src="https://mudi.com.co/cliente/${idCompany}/closeModal.webp" alt="closeModalMudi" type="image/webp" class="closeModal" width:50px>
                    <h2 class="modalTitleMudi">Recomendaciones para ver el producto en Realidad Aumentada.</h2>

                    <div class="principalContentModalAR">

                        <div class="fristContentMudi">

                            <div class="containerMudiSteps">
                                <img class="imgStepMudi" src="https://mudi.com.co/cliente/${idCompany}/step1.webp">
                                <div class="containerStepsText">
                                    <h3 class="stepTitleMudi">Apunta tu teléfono al piso para ver el producto.</h3>
                                    <p class="stepParagrahpMudi">Prueba otro espacio si no puedes ver el producto.</p>
                                </div>
                            </div>

                            <div class="containerMudiSteps">
                                <img class="imgStepMudi" src="https://mudi.com.co/cliente/${idCompany}/step2.webp">
                                <div class="containerStepsText">
                                    <h3 class="stepTitleMudi">Desplaza para visualizar.</h3>
                                    <p class="stepParagrahpMudi">Mueve tu dedo en la pantalla para rotar la imagen.</p>
                                </div>
                            </div>

                            <div class="containerMudiSteps">
                                <img class="imgStepMudi" src="https://mudi.com.co/cliente/${idCompany}/step3.webp">
                                <div class="containerStepsText">
                                    <h3 class="stepTitleMudi">Amplia y detalla el producto.</h3>
                                    <p class="stepParagrahpMudi">Controla el zoom arrastrando dos dedos en la pantalla de adentro hacia afuera.</p>
                                </div>
                            </div>

                            <div class="containerMudiSteps">
                                <img class="imgStepMudi" src="https://mudi.com.co/cliente/${idCompany}/step4.webp">
                                <div class="containerStepsText">
                                    <h3 class="stepTitleMudi">Toca dos veces para restablecer.</h3>
                                    <p class="stepParagrahpMudi">Vuelve al tamaño original haciendo doble click sobre el producto.</p>
                                </div>
                            </div>

                            <button class="initARMudi">Iniciar AR</button>

                        </div>

                        <div class="secondContentMudi">
                            <h3 class="stepTitleMudi qrTitlePart"> Escanea el código QR para ver el producto en realidad aumentda.</h3>
                            <div class="containerQRMudi"></div>
                            <img class="powerByMudi" src="https://mudi.com.co/Assets/SVG/powerByMudi.webp" type="image/webp" alt="Power By Mudi">
                        </div>

                    </div>

                </div>
            `;

            div.querySelector('.closeModal').addEventListener('click',()=>{
                document.querySelector('.windowModalMudi').remove();
            }, false) ;

            /* Determinamos que codigo QR se va a visualizar */ 
            linkQRAD == null || linkQRAD == undefined || linkQRAD =='' ?  createQRnormal() :  createQRAdvanced();
                
            function createQRnormal(){
                const img = document.createElement('img')
                img.classList.add('codeQRMudi');
                img.src = `${linkQR}`;
                img.addEventListener('load',()=>{
                    loadImg[4]=true
                },false);

                div.querySelector('.containerQRMudi').appendChild(img);
            };

            function createQRAdvanced(){
                const iframe = document.createElement('IFRAME'); 
                iframe.classList.add('codeQRMudi');
                iframe.src=`${linkQRAD}`;
                div.querySelector('.containerQRMudi').appendChild(iframe);
            };
      
            document.body.appendChild(div)
        };

};


