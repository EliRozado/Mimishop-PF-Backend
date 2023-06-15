export function userDocsVerifyHelper(user){
    const documents = user.documents.findIndex((doc) => doc.name == 'id') + user.documents.findIndex((doc) => doc.name == 'address') + user.documents.findIndex((doc) => doc.name == 'status') 
    if(documents == 3){
        return true
    }else{
        return false
    }
    
}