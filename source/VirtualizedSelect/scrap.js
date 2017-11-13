const arr = [
        {
        groupName:'Samsung',
        brands: [
          {
            brandName:'Samsung (Global)',
            countryCode: 'US',
            countryName: 'USA'
          },
          {
            brandName:'SamsungPay (Global)',
            countryCode: 'AU',
            countryName: 'Global'
          },
          {
            brandName:'Samsung Smart TV (France)',
            countryCode: 'FR',
            countryName: 'France'
          },
        ]
        },
        {
        groupName:'Turner',
        brands: [
          {
            brandName:'Turner (Global)',
            countryCode: 'US',
            countryName: 'USA'
          },
          {
            brandName:'TurnerPay (Global)',
            countryCode: 'AU',
            countryName: 'Global'
          },
          {
            brandName:'TurnerTV (France)',
            countryCode: 'FR',
            countryName: 'France'
          }
        ]
        },
        {
        groupName:'Cartoon Network',
        brands: [
          {
            brandName:'Cartoon Network (Global)',
            countryCode: 'US',
            countryName: 'USA'
          },
          {
            brandName:'Cartoon Network Pay (Global)',
            countryCode: 'AU',
            countryName: 'Global'
          },
          {
            brandName:'Cartoon Network (France)',
            countryCode: 'FR',
            countryName: 'France'
          }
        ]
        },
        {
        groupName:'New Network',
        brands: [
          {
            brandName:'New Network (Global)',
            countryCode: 'US',
            countryName: 'USA'
          },
          {
            brandName:'New Network Pay (Global)',
            countryCode: 'AU',
            countryName: 'Global'
          },
          {
            brandName:'New Network (France)',
            countryCode: 'FR',
            countryName: 'France'
          }
        ]
        } 
    ]// end

const searchString = 'tv'.toLowerCase();




const results = arr.filter((obj) => {

    const groupMatches = obj.groupName.toLowerCase().indexOf(searchString) !== -1; //bool
  
  const brands = obj.brands.filter((brand) => {
      return brand.brandName.toLowerCase().indexOf(searchString) !== -1;
  }); //array

    if (groupMatches || brands.length > 0) {
      return true;
  }
  return false;
});

console.log(JSON.stringify(results, null, 2));


