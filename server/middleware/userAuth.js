import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
  const token = req.cookies;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    jwt.verify(token,process.env.JWT_SECRET)
    if(tokenDecode.id){
      req.body.userId = tokenDecode.id;
    }else { 
      return res.json({ success: false, message: 'Invalid token' });
    }
    next();
  } catch (error) {
    res.json({ success: false, message: 'Invalid token' })
  }
}
export default userAuth;