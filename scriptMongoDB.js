// Membuat Database Baru
use populations

// Menyisipkan Dokumen ke Dalam Koleksi
db.cities.insertOne({"name": "Jakarta", "country": "Indonesia", "continent": "Asia", "population": 25.674 })

// Menampilkan Seluruh Dokumen dalam Koleksi
db.cities.find()

// Mencari Dokumen dengan Kriteria Tertentu
db.cities.find({name: "Seoul"})

// Memperbarui Dokumen
db.cities.updateOne({name: "Mumbai"}, {$set: {population: 25.674}})

// Hapus Dokumen
db.cities.deleteOne({name: "Osaka"})

// Menambahkan Beberapa Dokumen
db.cities.insertMany([
        {"name": "Seoul", "country": "South Korea", "continent": "Asia", "population": 25.674 },
        {"name": "Mumbai", "country": "India", "continent": "Asia", "population": 19.980 },
        {"name": "Lagos", "country": "Nigeria", "continent": "Africa", "population": 13.463 },
        {"name": "Beijing", "country": "China", "continent": "Asia", "population": 19.618 },
        {"name": "Shanghai", "country": "China", "continent": "Asia", "population": 25.582 },
        {"name": "Osaka", "country": "Japan", "continent": "Asia", "population": 19.281 },
        {"name": "Cairo", "country": "Egypt", "continent": "Africa", "population": 20.076 },
        {"name": "Tokyo", "country": "Japan", "continent": "Asia", "population": 37.400 },
        {"name": "Karachi", "country": "Pakistan", "continent": "Asia", "population": 15.400 },
        {"name": "Dhaka", "country": "Bangladesh", "continent": "Asia", "population": 19.578 },
        {"name": "Rio de Janeiro", "country": "Brazil", "continent": "South America", "population": 13.293 },
        {"name": "São Paulo", "country": "Brazil", "continent": "South America", "population": 21.650 },
        {"name": "Mexico City", "country": "Mexico", "continent": "North America", "population": 21.581 },
        {"name": "Delhi", "country": "India", "continent": "Asia", "population": 28.514 },
        {"name": "Buenos Aires", "country": "Argentina", "continent": "South America", "population": 14.967 },
        {"name": "Kolkata", "country": "India", "continent": "Asia", "population": 14.681 },
        {"name": "New York", "country": "United States", "continent": "North America", "population": 18.819 },
        {"name": "Manila", "country": "Philippines", "continent": "Asia", "population": 13.482 },
        {"name": "Chongqing", "country": "China", "continent": "Asia", "population": 14.838 },
        {"name": "Istanbul", "country": "Turkey", "continent": "Europe", "population": 14.751 }
])

// Mencari dengan Query Operator
db.cities.find({population: {$gt: 15}})

// Menghitung Jumlah Kota dengan Kriteria Tertentu
db.cities.find({population: {$gt: 15}}).count()

// Membuat Index pada Koleksi untuk Optimalisasi Query
db.cities.createIndex({population: 1})

// Menampilkan Index yang Ada pada Koleksi
db.cities.getIndexes()

// Menghapus Database
db.dropDatabase()

// AGGREGATE
// 1. Mengetahui Rata-rata Populasi Berdasarkan Benua
var avgPopulationResult = db.cities.aggregate([
    {$group: {_id: "$continent", averagePopulation: {$avg: "$population"}}}
]).toArray();

printjson(avgPopulationResult);

// 2. Menghitung Jumlah Kota per Negara
var cityCountByCountry = db.cities.aggregate([
    {$group: {_id: "$country", numberOfCities: {$sum: 1}}}
]).toArray();

printjson(cityCountByCountry);


// 3. Mencari Kota dengan Populasi Terendah dan Tertinggi
// Kota dengan populasi terendah
var lowestPopulationCity = db.cities.aggregate([
    {$sort: {population: 1}},
    {$limit: 1}
]).toArray();

// Kota dengan populasi tertinggi
var highestPopulationCity = db.cities.aggregate([
    {$sort: {population: -1}},
    {$limit: 1}
]).toArray();

printjson(lowestPopulationCity);
printjson(highestPopulationCity);


// 4. Menghitung Total Populasi per Benua
var totalPopulationByContinent = db.cities.aggregate([
    {$group: {_id: "$continent", totalPopulation: {$sum: "$population"}}}
]).toArray();

printjson(totalPopulationByContinent);


// 5. Menampilkan Negara dan Kota dalam Benua yang Sama
var countriesAndCitiesByContinent = db.cities.aggregate([
    {$group: {_id: "$continent", countries: {$addToSet: "$country"}, cities: {$addToSet: "$name"}}}
]).toArray();

printjson(countriesAndCitiesByContinent);


// 6. Mengurutkan Negara Berdasarkan Populasi Terendah
var countriesByLowestAveragePopulation = db.cities.aggregate([
    {$group: {_id: "$country", avgPopulation: {$avg: "$population"}}},
    {$sort: {avgPopulation: 1}}
]).toArray();

printjson(countriesByLowestAveragePopulation);


// 7. Mengetahui Variasi Populasi di Setiap Negara
var populationVarianceByCountry = db.cities.aggregate([
    {$group: {_id: "$country", populationStdDev: {$stdDevSamp: "$population"}}}
]).toArray();

printjson(populationVarianceByCountry);


// 8. Mencari Kota-kota dengan Populasi di Atas Rata-rata Global
var globalAvgPopulationResult = db.cities.aggregate([
    {$group: {_id: null, globalAvgPopulation: {$avg: "$population"}}}
]).toArray();

var globalAvgPopulation = globalAvgPopulationResult[0].globalAvgPopulation;

var citiesAboveGlobalAvg = db.cities.find({population: {$gt: globalAvgPopulation}}).toArray();

printjson(citiesAboveGlobalAvg);

// 9. Mengelompokkan Kota Berdasarkan Ukuran Populasi
var citiesBySize = db.cities.aggregate([
    {$bucket: {
        groupBy: "$population",
        boundaries: [0, 10, 20, 30, 40],
        default: "40+",
        output: {
            "count": {$sum: 1},
            "cities": {$push: "$name"}
        }
    }}
]).toArray();

printjson(citiesBySize);
