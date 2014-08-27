define(['jquery'], function ($){
    return {
        createPath: function(name, type, ext){
            var baseurl = $("#assetsbaseurl").val();
            return (baseurl + "/spritesheets/" + type + "/" + name + "." + ext);
        }
    };
});
