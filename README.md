# ghost-azure-search
A couple of scripts to automatically generate and maintain an Azure Search index from a Ghost blog.

Refer to [http://blog.jourdant.me/enabling-your-ghost-blog-with-azure-search](http://blog.jourdant.me/enabling-your-ghost-blog-with-azure-search) for the full instructions.

##Summary
1. Clone repo
2. Add your Azure Search index name and key into scripts
3. Add your Ghost blog credentials into update script
4. Run create_index.js
5. Run update_index.js
6. *Place update_index.js into a zip file and upload into an Azure Web Job (optional)*