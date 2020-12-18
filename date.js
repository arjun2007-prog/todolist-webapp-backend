
exports.getDate = function (){
    let today = new Date();

    const options = {
       month:"long",
       day:"numeric",
       weekday:"long",
   }
   return  today.toLocaleDateString("en-US",options);
}