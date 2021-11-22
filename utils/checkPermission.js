const checkPermission = (user, order)=>{
    if(user.role === 'admin') return true;
    if(user.userId === order.user.toString())return true;
    return false
}

module.exports = checkPermission