//removing the try and catch block by using WrapAsync Funciton
module.exports.WrapAsync = async (fn) => {
    return function (req, res, next) {
        fn(req, res, next)
            .catch((error) => {
                res.status(500).json({
                    message: error.message,
                })
            })
    }
}
