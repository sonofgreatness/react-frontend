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


     getXDatapoints = () =>{
        const storedData = localStorage.getItem('x_datapoints');
    return storedData ? JSON.parse(storedData) : [];
    }
     getXIndices = () =>{
        const storedData = localStorage.getItem('logger_indices');
        return storedData ? JSON.parse(storedData) : [];
    }

    getAPIURL = () =>  {

        return   window.location.hostname === "localhost"
        ? "http://localhost:8000/api"
        : "https://django2-nine.vercel.app/api";
    }

    getAPIADMINURL = () =>{
        return   window.location.hostname === "localhost"
        ? "http://localhost:8000/admin"
        : "https://django2-nine.vercel.app/admin";
    } 

}
export default new util();