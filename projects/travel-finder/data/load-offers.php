[
<?php 
  include("../php/phpcrawl/libs/PHPCrawler.class.php");
  include("../php/simplehtmldom/simple_html_dom.php");

  $source = [
    ["weekenddesk", "http://www.weekendesk.fr/idee-week-end-sejour/2gqg/Derniere_minute"],
    ["pierreetvacances", "https://www.pierreetvacances.com/fr-fr/ponts_om"],
    ["thomascook", "http://www.thomascook.fr/promo-weekend/"],
    ["havas", "http://www.havas-voyages.fr/forfait"]
  ];

  $counter = 0;
  foreach($source as $item) {
    $PageContent = file_get_html( $item[1] );

    // Find all offers
    if( $item[0] == "weekenddesk" ) {
      foreach($PageContent->find(".Offers_content .Offers_offer") as $offer) {
        if( $counter > 0 ) { echo ","; }
        $priceOffer = trim($offer->find("div.Offers_description > div.Offers_descriptionLayout > div.Offers_includedBlock > div.Offers_priceBlock > div.Offers_price", 0)->plaintext);
?>
        {
          "id": <?php echo $counter + 1; ?>,
          "name": "<?php echo trim($offer->find("div.Offers_description > div.Offers_descriptionLayout > a", 0)->plaintext); ?>",
          "link": "<?php echo "http://www.weekendesk.fr" . trim($offer->find("div.Offers_description > div.Offers_descriptionLayout > a", 0)->href); ?>",
          "img": "<?php echo trim($offer->find("div.Offers_imageLayout > a > img", 0)->src); ?>",
          "place": "<?php echo trim($offer->find(".location_container > span:nth-child(3)", 0)->plaintext); ?>",
          "price": "<?php echo str_replace("€*", "", $priceOffer); ?>",
          "date": "",
          "source": "Weekenddesk"
        }
<?php
        $counter = $counter + 1;
      }
    } elseif( $item[0] == "pierreetvacances" ) {
      foreach($PageContent->find("div.pv-GridContainer section div.pv-ProductItem-container") as $offer) {
        if( $counter > 0 ) { echo ","; }
        $priceOffer = trim($offer->find("div.pv-ProductItem-moreInfos > div div span.pv-Price-current .pv-mainPriceContainer > span", 0)->plaintext);
?>
        {
          "id": <?php echo $counter + 1; ?>,
          "name": "<?php echo trim($offer->find("div.pv-ProductItem-top > a", 0)->plaintext) ?>",
          "link": "<?php echo trim($offer->find("div.pv-ProductItem-top > a", 0)->href) ?>",
          "img": "<?php echo trim($offer->find("picture source", 0)->getAttribute("data-original-set")) ?>",
          "place": "<?php echo trim($offer->find("div.pv-ProductItem-top > p.pv-ProductItem-dest", 0)->plaintext) ?>",
          "price": "<?php echo str_replace(" &euro;", "", $priceOffer) ?>",
          "date": "<?php echo trim($offer->find("p.pv-product-date", 0)->plaintext) ?>",
          "source": "Pierre & Vacances"
        }
<?php
        $counter = $counter + 1;
      }
    } elseif( $item[0] == "thomascook" ) {
      foreach($PageContent->find("#innercontent > div.tccontainer div.tcrow div.bloc_sejours_famille") as $offer) {
        $dateOffer = trim($offer->find("p.info-depart span.date", 0)->plaintext);
        $nameOffer = trim($offer->find("div.description > span", 0)->plaintext);

        if( strlen($nameOffer) > 0 ) {
          if( $counter > 0 ) { echo ","; }
?>
          {
            "id": <?php echo $counter + 1; ?>,
            "name": "<?php echo $nameOffer ?>",
            "link": "<?php echo trim($offer->find("p.image a", 0)->href) ?>",
            "img": "<?php echo trim($offer->find("p.image a img", 0)->src) ?>",
            "place": "<?php echo trim($offer->find("div.description p.sub", 0)->plaintext) ?>",
            "price": "<?php echo trim($offer->find("div.pricing .prix", 0)->getAttribute("data-tracking-value")) ?>",
            "date": "<?php echo str_replace("le ", "", $dateOffer) ?>",
            "source": "Thomas Cook"
          }
<?php
          $counter = $counter + 1;
        }
      }
    } elseif( $item[0] == "havas" ) {
      foreach($PageContent->find("article.frt_blocOffres .frt_liBlocOffres") as $offer) {
        if( $counter > 0 ) { echo ","; }
        $priceOffer = trim($offer->find(".frt_liBlocOffresPrix .prix", 0)->plaintext);
?>
        {
          "id": <?php echo $counter + 1; ?>,
          "name": "<?php echo trim($offer->find(".frt_liBlocOffresSsTitre", 0)->plaintext) ?>",
          "link": "<?php echo trim($offer->find(".frt_liBlocOffres_content > a", 0)->href) ?>",
          "img": "<?php echo trim($offer->find(".frt_liBlocOffresImage_container > img", 0)->getAttribute("data-src")) ?>",
          "place": "<?php echo trim($offer->find(".frt_liBlocOffres_content .frt_liBlocOffresTitre", 0)->plaintext) ?>",
          "price": "<?php echo str_replace(" €", "", $priceOffer) ?>",
          "date": "",
          "source": "Havas"
        }
<?php
        $counter = $counter + 1;
      }
    }
  }
?>
]