const UserCollection = require('../models/user');
const ProductCollection = require('../models/product');
const BidCollection = require('../models/bid');
const FeedbackCollection = require('../models/feedback');
var passwordhash = require('password-hash');
const mail = require('../../utils/mail');
const userOperations = {
    addUser(userObject,res){
        var hash = passwordhash.generate(userObject.password);
        userObject.password = hash;
        UserCollection.create(userObject,(err)=>{
            if(err){
                console.log('Error occured during adding to db:',err);
                res.json({"msg":"Error occured during adding to db"})
            }
            else{
                res.json({"msg":"Registerd Successfully"});
            }
        });
    },
    searchUser(userObject,res){
        UserCollection.findOne({'userid':userObject.userid},(err,doc)=>{
            if(err){
                console.log('Error occurred during searching in db ',err);
                res.json({"msg":"Error occurred during searching in db"});
            }
            else if(doc){
                var result = passwordhash.verify(userObject.password,doc.password);
                if(result){
                    res.json({"msg":doc.name,"userObject":doc,"isLoggedIn":"true"});
                }
                else{
                    res.json({"msg":"Invalid UserId or Password","isLoggedIn":"false"});
                }
            }
            else{
                res.json({"msg":"Invalid UserId or Password","isLoggedIn":"false"});
            }
        })
    },
    changePassword(userObject,res){
        var userInfo = {'_id':userObject._id,'password':userObject.oldpassword};
        UserCollection.findOne({'_id':userInfo._id},(err,doc)=>{
            if(err){
                res.json({"msg":"Error occured during searching in DB"});
                console.log("Error occured during searching in DB is ",err);
            }
            else if(doc){
                var result = passwordhash.verify(userInfo.password,doc.password);
                if(result){
                    var hash = passwordhash.generate(userObject.newpassword);
                    userObject.newpassword = hash; 
                   UserCollection.updateOne({'_id':userInfo._id},{'password':userObject.newpassword},(err)=>{
                       if(err){
                           res.json({"msg":"Error occured During Changing Password"});
                           console.log("Error occured During Changing Password is ",err);
                       }
                       else{
                           res.json({"msg":"Password changed Successfully"});
                       }
                   })
                }
                else{
                    res.json({"msg":"Invalid old Password"});
                }
            }
            else{
                res.json({"msg":"Record Not Found"});
            }
        })
    },
    async addProduct(reqObject,res){
        var userid = reqObject._id;
       // var productObject = {"pid":reqObject.id,"pname":reqObject.name,"pdesc":reqObject.pdesc,"amount":reqObject.amount,"time":reqObject.time,"category":reqObject.name,"image":reqObject.name};
        var user = await UserCollection.findById(userid,(err,doc)=>{
            if(err){
               console.log('Error occured in finding user ',err);
                res.json({'msg':'Error occured in finding user'});
            }
        });
        console.log('User is ',user.userid);
        await ProductCollection.create({
            'author':user,
            'pname':reqObject.pname,
            'pdesc':reqObject.pdesc,
            'amount':reqObject.amount,
            'time':reqObject.time,
            'category':reqObject.category,
            'image':reqObject.image
        },async (err,doc)=>{
            if(err){
                console.log('Error while adding product ',err);
                res.json({'msg':'error while adding product'});
            }
            else if(doc){
        await user.products.push(doc._id);
        await user.save();
        res.json({'msg':"Product added successfully",'pid':doc._id});
        }
        });
    },
    productList(res){
        ProductCollection.find({},(err,doc)=>{
            if(err){
                console.log('Error while fetching products ',err);
                res.json({'msg':'Error while fetching products'})
            }
            else{
                res.json({'products':doc});
            }
        })
    },
    deleteProduct(reqObject,res){
       UserCollection.updateOne({'products':reqObject.pid},{$pull:{'products':reqObject.pid}},(err,doc)=>{
            if(err){
                console.log("Error occured during deletion",err)
                res.send("Error occured during deletion");
            }
            else if(doc){
                console.log(doc);
                ProductCollection.deleteOne({_id:reqObject.pid},(err,doc)=>{
                    if(err){
                        console.log('Error occured during deleting from product collection',err);
                        res.send("Error occured during deleting from product collection")
                    }
                    else if(doc){
                        console.log(doc);
                        BidCollection.deleteMany({pid:reqObject.pid},(err,doc)=>{
                            if(err){
                                console.log('Error occured during deleting from product collection ',err);
                                res.send("Error occured during deleting from product collection")
                            }
                            else if(doc){
                                console.log(doc);
                            }
                        })
                        res.json({"msg":'Product Deleted Successfully'});
                    };
                });
            }
        });      
        },
    async addBid(reqObject,res){
        var userid = reqObject._id;
        var user = await UserCollection.findById(userid,(err,doc)=>{
            if(err){
               console.log('Error occured in finding user ',err);
                res.json({'msg':'Error occured in finding user'});
            }
        });
        BidCollection.findOne({'author':reqObject._id,'pid':reqObject.pid},(err,doc)=>{
            if(err){
                console.log('Error while searching in bid ',err);
                res.json({'msg':'error while searching in bid'});
            }
            else if(doc){
                console.log('Doc is ',doc);
                res.json({'msg':'You have already bidded for this product'});
            }
            else{
                BidCollection.create({
                    'author':userid,
                    'pid':reqObject.pid,
                    'bidamount':reqObject.amount,
                    'bidded_on':new Date()
                },async (err,doc)=>{
                    if(err){
                        console.log('Error while adding bid ',err);
                        res.json({'msg':'error while adding bid'});
                    }
                    else if(doc){
                // await user.bids.push(doc._id);
                // await user.save();
                res.json({'msg':"Bid added successfully",'bidId':doc._id});
                }
                });
            }
        })   
        },
      async getBids(pid,res){
        var bidList = [];   
        await BidCollection.find({'pid':pid},async (err,bids)=>{
            if(err){
                console.log('Error while searching in bids ',err);
                res.json({'msg':'error while searching in bids'});
            }
            else if(bids){
                console.log('Bids is ',bids);
                for(var bid of bids){
                console.log('Bid is ',bid);
                await UserCollection.findOne({'_id':bid.author},(err,user)=>{
                    if(err){
                        console.log('Error while searching in users ',err);
                        res.json({'msg':'error while searching in bids'});
                    }
                    else if(user){
                        console.log('User is ',user);
                        var bidObject = {'name':user.name,'bidamount':bid.bidamount}
                        console.log('Name is '+user.name+'Bid Amount is '+bid.bidamount)
                        bidList.push(bidObject);
                    }
                })
                }
                res.json({'bidList':bidList})
            }  
        })
      },  
      async endAuction(pid,res){
       var product = await ProductCollection.findOne({'_id':pid});  
       if(product==null){
        res.json({'msg':'Product does not exist','status':'fail'});
       }
       else{   
       await BidCollection.find({'pid':pid},async (err,bids)=>{
        if(err){
            console.log('Error while searching in bids ',err);
            res.json({'msg':'error while searching in bids'});
        }
        else if(bids){
            console.log('Bids is ',bids);
            var seller = await UserCollection.findOne({'_id':product.author});
            console.log('Seller is ',seller);
            if(bids.length==0){
                console.log('Product is ',product.pname);
                var email = seller.email;
                var message = 'Unlucky!Your product '+`<u>${product.pname}</u>`+' has no bids in the auction.';
                mail(email,message,res);
                res.json({'msg':'No Bids for this Product','status':'success','product':product})
            }
            else{
            var bidObject = bids.reduce(function(prev,curr){
                return (prev.bidamount>curr.bidamount)?prev:curr
            });
            console.log('Bid Object is ',bidObject);
                    await UserCollection.findOne({'_id':bidObject.author},async (err,user)=>{
                        if(err){
                            console.log('Error while searching in users ',err);
                            res.json({'msg':'error while searching in users'});
                        }
                        else if(user){
                            console.log('Bidder is ',user);
                            var email = user.email;
                            var message = 'Congratulations!You have got the product '+`<u>${product.pname}</u>`+' for ₹'+`<u>${bidObject.bidamount}</u>`+' in the auction.';
                            mail(email,message,res);                            
                            var e = seller.email;
                            var m = 'Congratulations!Your product '+`<u>${product.pname}</u>`+' has been bidded for ₹'+`<u>${bidObject.bidamount}</u>`+' in the auction.';
                            mail(e,m,res);
                            res.json({'status':'success','product':product});
                }
            })
        }
       }
      })
     }
    },
    addFeedback(feedObject,res){
        FeedbackCollection.create(feedObject,(err)=>{
            if(err){
                console.log('Error occured during adding to db:',err);
                res.json({"msg":"Error occured during adding to db"})
            }
            else{
                res.json({"msg":"Feedback Sent Successfully"});
            }
        });
    },
    feedbackList(res){
        FeedbackCollection.find({},(err,doc)=>{
            if(err){
                console.log('Error occured during searching in db:',err);
                res.json({"msg":"Error occured during searching in db"})
            }
            else{
                res.json({'feedbacks':doc});
            } 
        })
    }
}
module.exports = userOperations;