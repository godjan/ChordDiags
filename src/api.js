import axios from 'axios';

const ApiProvider = {
    MONGO_API_KEY: "50a1b72be4b0b7ff94310db8",
    DIAGS_DB_URL: "https://api.mongolab.com/api/1/databases/diags/collections/tunes",
    USERS_DB_URL: "https://api.mongolab.com/api/1/databases/diags/collections/users"
};

export default {

    getSheets() {

        const filter = '{"isPrivate" :false}',
              fields = '{ "title":1, "tags":1, "description":1, "author":1, "authorId":1, "isPrivate": 1, "docTitle":1}';

        return  axios.get(`${ApiProvider.DIAGS_DB_URL}?apiKey=${ApiProvider.MONGO_API_KEY}`); //&f=${fields}`);
    },

    getSheet(id) {

       return  axios.get(`${ApiProvider.DIAGS_DB_URL}/${id}?apiKey=${ApiProvider.MONGO_API_KEY}`);
    },
    
   createSheet(sheet) {

        return axios.post(`${ApiProvider.DIAGS_DB_URL}?apiKey=${ApiProvider.MONGO_API_KEY}`, sheet);
   },

   updateSheet(sheet) {

     return axios.put(`${ApiProvider.DIAGS_DB_URL}/${sheet._id.$oid}?apiKey=${ApiProvider.MONGO_API_KEY}`, sheet);
   }
}