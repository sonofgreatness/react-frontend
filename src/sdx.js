export const sdx={
    setData:function(data){
        Object.keys(data).forEach((k)=>{
            this.d[k]=data[k];
        })
        this.changeState();
    },

    d:{
    },
}