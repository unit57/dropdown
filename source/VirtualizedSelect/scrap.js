const data = [
                {
                  groupName: 'Samsung',
                    brands: [
                      {
                          brandName: 'Samsung (Global)',
                          countryCode: 'US',
                          countryName: 'USA'
                      },
                        {
                          brandName: 'SamsungPay (Global)',
                          countryCode: "AU",
                          countryName: 'Global'
                      },
                      {
                        brandName: 'Samsung Smart TV (France)',
                        countryCode: 'FR',
                        countryName: 'France'
                      }
                    ]
                  },
                {
                  groupName: 'Turner',
                    brands: [
                      {
                          brandName: 'Turner (Global)',
                          countryCode: 'US',
                          countryName: 'USA'
                      },
                        {
                          brandName: 'Turner Pay (Global)',
                          countryCode: "AU",
                          countryName: 'Global'
                      },
                      {
                        brandName: 'Turner Smart TV (France)',
                        countryCode: 'FR',
                        countryName: 'France'
                      }
                    ]
                  },
                  {
                  groupName: 'Cartoon Network',
                    brands: [
                      {
                          brandName: 'Samsung (Global)',
                          countryCode: 'US',
                          countryName: 'USA'
                      },
                        {
                          brandName: 'SamsungPay (Global)',
                          countryCode: "AU",
                          countryName: 'Global'
                      },
                      {
                        brandName: 'Samsung Smart TV (France)',
                        countryCode: 'FR',
                        countryName: 'France'
                      }
                    ]
                  }            
              ];// end

const options = data.map(d => d.groupName); // get array of group names
console.log(options);
const newOptions = [].concat(options); // copy array
const indexClicked = 1; // get index of group clicked
const brandOptions = data[indexClicked].brands.map(b => b.brandName); // get brand names

newOptions.splice(indexClicked + 1, 0, ...brandOptions);

//newOptions.splice(indexClicked + 1, brandOptions.length); // click on the same group again to collapse

console.log(newOptions);