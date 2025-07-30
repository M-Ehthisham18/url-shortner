import URL from '../models/url.model.js';

const handleAdminLogin = async (req, res ) => {
  const { password } = req.params;

  if(password === process.env.ADMIN_PASSWORD) {
    // await URL.find({}).sort({ createdAt: -1 }).limit(10).exec((err, urls) => {
    //   if (err) {
    //     return res.status(500).json({ error: 'Error fetching URLs' });
    //   }
    //   return res.status(200).json({ message: "Admin login successful", urls });
    // });
    let allUsers=[] ;
    await URL.find().then((users) => {
      users.map((user) =>{
      allUsers.push({user: user.shortId, count : user.visitHistory.length})
    });
    })
    return res.status(200).json({ users : allUsers });
  } else {

  }
}

const handleAdminAnalytics = async (req, res) => {
  const { password , shortId} = req.params;
  if(password === process.env.ADMIN_PASSWORD){
    try {    
      const urlData = await URL.findOne({shortId}).select("-createdAt -updatedAt -_id");
      
      if (!urlData) {
        return res.status(404).json({ error: 'URL not found' });
      }
      return res.status(200).json(urlData );
    } catch (error) {
      return res.status(500).json({ error: error.message || 'Error fetching URL analytics' });
      
    }
  }
}

export {
  handleAdminLogin,
  handleAdminAnalytics,
}