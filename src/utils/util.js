let $ = window.$;
class util {
    
    showLoader = () => {
        var el = '<div class="bodycover"></div><div class="loader"><i class="fa fa-spin fa-circle-notch"></i></div>';
        $(".bodycover,.loader").remove();
        $("body").prepend(el);
    }

    hideLoader = () => {
        $(".bodycover,.loader").remove();
    }


 

    getAPIURL = () =>  {

        return   window.location.hostname === "localhost"
        ? "http://localhost:8000/api"
        : "https://django2-nine.vercel.app/api";
    }

    getAPIADMINURL  = () =>{

        return   window.location.hostname === "localhost"
        ? "http://localhost:8000/admin"
        : "https://django2-nine.vercel.app/admin";
    } 

}
export default new util();