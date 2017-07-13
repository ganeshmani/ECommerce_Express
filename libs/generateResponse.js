

exports.generateResponse = function(err,msg,status,data)
{
    var response = {
       error : err,
       message : msg,
       status : status,
       data : data
    }

    return response;

}
