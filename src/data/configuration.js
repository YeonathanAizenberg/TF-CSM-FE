export default{
  "data": {
    "areas": [
      {
        "name": "areaColumnText",
        "blocks": [
          {
            "id": "blockID1",
            "type":"borderText",
            "version":'1',
            "htmlTemplatePath": "../components/borderText/borderText.ejs",
            "cssPath": "../components/borderText/borderText.scss",
            "data": {
              "title": "L’AVIS D’EXPERT",
              "text": "«Luuu Plagne, plusieurs univers dans un domaine skiable unique et varié. Des stations fonctionnelles, stations villages ou de haute altitude. Vous avez le choix ! Skiez au coeur des forêts de Plagne Montalbert - idéal pour les débutants jusqu'au glacier de Bellecôte en passant par le Mont de Guerre et sa chapelle avec une vue imprenable. Et pour les non skieurs, un détour sur le plateau du Dou du Praz s'impose. La Plagne vous attend pour vous créer une montagne de souvenirs ».",
              "linkText": "Découvrez le TOP 5 des activités à sensations fortes de La Plagne"
            }
          },
          {
            "id":"blockID2",
            "type":"borderText",
            "version":'1',
            "htmlTemplatePath": "../components/borderText/borderText.ejs",
            "cssPath": "../components/borderText/borderText.scss",
            "data": {
              "title": "3 BONNES RAISONS DE PARTIR",
              "text": "«La Plagne, plusieurs univers dans un domaine skiable unique et varié. Des stations fonctionnelles, stations villages ou de haute altitude. Vous avez le choix ! Skiez au coeur des forêts de Plagne Montalbert - idéal pour les débutants jusqu'au glacier de Bellecôte en passant par le Mont de Guerre et sa chapelle avec une vue imprenable. Et pour les non skieurs, un détour sur le plateau du Dou du Praz s'impose. La Plagne vous attend pour vous créer une montagne de souvenirs ».",
              "linkText": "Découvrez le TOP 5 des activités à sensations fortes de La Plagne"
            }
          },
          {
            "id": "blockID3",
            "type":"video",
            "version":'1',
            "htmlTemplatePath": "../components/imageBox/imageBox.ejs",
            "cssPath": "../components/imageBox/borderText.scss",
            "data": {
              "title": "EN VIDÉO",
              "url": "https://picsum.photos/200",
            }
          }
        ]
      },
      {
        "name": "areaOffer",
        "blocks": [
          {
            "htmlTemplatePath": "../components/offersCards/offersCards.ejs",
            "cssPath": "../components/offersCards/offersCards.scss",
            "data": {
              "wsUrl": "http://localhost/offer/111",
              "type": "offer",
              "linkText": "My best offers1",
              "result": []
            }
          }
        ]
      },
      {
        "name": "areaSEO",
        "blocks": [
          {
            "htmlTemplatePath": "../components/areaSEO/areaSEO.ejs",
            "data": {
              "wsUrl": "http://localhost/seo/111",
              "type": "SEO",
              "linkText": "My SEO",
              "result": []
            }
          }
        ]
      }
    ]
  }
}