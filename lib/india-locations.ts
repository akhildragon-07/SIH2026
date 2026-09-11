/**
 * Master Dataset and Utilities for Indian States, Districts, Centroids, and Normalization
 */

export interface DistrictInfo {
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  aliases?: string[];
}

export interface StateInfo {
  name: string;
  code: string;
  aliases: string[];
  districts: string[];
}

// Master Indian States and Districts with centroid coordinates
export const INDIA_STATES_DISTRICTS: Record<string, StateInfo> = {
  'Tamil Nadu': {
    name: 'Tamil Nadu',
    code: 'TN',
    aliases: ['tamil nadu', 'tamilnadu', 'tamil nad', 'tn', 'தமிழ்நாடு', 'தமிழ் நாடு', 'तमिलनाडु'],
    districts: [
      'Chennai',
      'Coimbatore',
      'Madurai',
      'Theni',
      'Dindigul',
      'Tiruchirappalli',
      'Salem',
      'Tirunelveli',
      'Erode',
      'Vellore',
      'Thoothukudi',
      'Tiruppur',
      'Kanchipuram',
      'Chengalpattu',
      'Thanjavur',
      'Cuddalore',
      'Villupuram',
      'Nagapattinam',
      'Kanniyakumari',
      'Karur',
      'Namakkal',
      'Dharmapuri',
      'Krishnagiri',
      'Pudukkottai',
      'Ramanathapuram',
      'Sivaganga',
      'Virudhunagar',
      'Nilgiris',
      'Perambalur',
      'Ariyalur',
      'Tiruvarur',
      'Tiruvannamalai',
      'Ranipet',
      'Tirupathur',
      'Tenkasi',
      'Mayiladuthurai',
      'Kallakurichi'
    ]
  },
  'Karnataka': {
    name: 'Karnataka',
    code: 'KA',
    aliases: ['karnataka', 'kar', 'ka', 'ಕರ್ನಾಟಕ', 'कर्नाटक'],
    districts: [
      'Bengaluru Urban',
      'Bengaluru Rural',
      'Mysuru',
      'Hubballi-Dharwad',
      'Dharwad',
      'Belagavi',
      'Kalaburagi',
      'Mangaluru',
      'Dakshina Kannada',
      'Udupi',
      'Ballari',
      'Shivamogga',
      'Tumakuru',
      'Davangere',
      'Hassan',
      'Bidar',
      'Vijayapura',
      'Raichur',
      'Chikkamagaluru',
      'Mandya',
      'Kolar',
      'Chamarajanagar',
      'Koppal',
      'Bagalkote',
      'Gadag',
      'Haveri',
      'Uttara Kannada',
      'Yadgir',
      'Chitradurga',
      'Ramanagara',
      'Kodagu'
    ]
  },
  'Andhra Pradesh': {
    name: 'Andhra Pradesh',
    code: 'AP',
    aliases: ['andhra pradesh', 'andhra', 'ap', 'ఆంధ్ర ప్రదేశ్', 'ఆంధ్రప్రదేశ్', 'आंध्र प्रदेश'],
    districts: [
      'Visakhapatnam',
      'Vijayawada',
      'Krishna',
      'Guntur',
      'Vizianagaram',
      'Tirupati',
      'Chittoor',
      'Srikakulam',
      'East Godavari',
      'West Godavari',
      'Kakinada',
      'Konaseema',
      'Eluru',
      'NTR',
      'Bapatla',
      'Palnadu',
      'Prakasam',
      'Nellore',
      'Kurnool',
      'Nandyal',
      'Ananthapuramu',
      'Sri Sathya Sai',
      'YSR Kadapa',
      'Annamayya',
      'Parvathipuram Manyam',
      'Alluri Sitharama Raju'
    ]
  },
  'Telangana': {
    name: 'Telangana',
    code: 'TS',
    aliases: ['telangana', 'ts', 'tg', 'తెలంగాణ', 'तेलंगाना'],
    districts: [
      'Hyderabad',
      'Warangal',
      'Hanamkonda',
      'Nizamabad',
      'Karimnagar',
      'Khammam',
      'Ranga Reddy',
      'Medchal-Malkajgiri',
      'Sangareddy',
      'Nalgonda',
      'Mahabubnagar',
      'Siddipet',
      'Adilabad',
      'Mancherial',
      'Jagtial',
      'Peddapalli',
      'Kamareddy',
      'Bhadradri Kothagudem',
      'Suryapet',
      'Vikarabad'
    ]
  },
  'Maharashtra': {
    name: 'Maharashtra',
    code: 'MH',
    aliases: ['maharashtra', 'maha', 'mh', 'महाराष्ट्र'],
    districts: [
      'Mumbai City',
      'Mumbai Suburban',
      'Pune',
      'Nagpur',
      'Thane',
      'Nashik',
      'Solapur',
      'Aurangabad',
      'Chhatrapati Sambhajinagar',
      'Amravati',
      'Kolhapur',
      'Navi Mumbai',
      'Nanded',
      'Sangli',
      'Jalgaon',
      'Akola',
      'Latur',
      'Dhule',
      'Ahmednagar',
      'Chandrapur',
      'Parbhani',
      'Satara',
      'Beed',
      'Yavatmal',
      'Wardha',
      'Bhandara',
      'Gondia',
      'Raigad',
      'Ratnagiri',
      'Sindhudurg',
      'Palghar',
      'Osmanabad',
      'Dharashiv',
      'Buldhana',
      'Washim',
      'Hingoli',
      'Gadchiroli',
      'Jalna'
    ]
  },
  'Rajasthan': {
    name: 'Rajasthan',
    code: 'RJ',
    aliases: ['rajasthan', 'raj', 'rj', 'राजस्थान'],
    districts: [
      'Jaipur',
      'Jodhpur',
      'Udaipur',
      'Kota',
      'Ajmer',
      'Bikaner',
      'Bhilwara',
      'Alwar',
      'Bharatpur',
      'Sikar',
      'Pali',
      'Sri Ganganagar',
      'Barmer',
      'Jaisalmer',
      'Chittorgarh',
      'Jhunjhunu',
      'Churu',
      'Nagaur',
      'Banswara',
      'Dungarpur',
      'Tonk',
      'Dausa',
      'Sawai Madhopur',
      'Jalore',
      'Sirohi',
      'Rajsamand',
      'Pratapgarh',
      'Hanumangarh',
      'Karauli',
      'Dholpur',
      'Baran',
      'Bundi',
      'Jhalawar'
    ]
  },
  'Uttar Pradesh': {
    name: 'Uttar Pradesh',
    code: 'UP',
    aliases: ['uttar pradesh', 'up', 'उत्तर प्रदेश', 'यूपी'],
    districts: [
      'Lucknow',
      'Kanpur Nagar',
      'Varanasi',
      'Prayagraj',
      'Agra',
      'Noida',
      'Gautam Buddha Nagar',
      'Ghaziabad',
      'Meerut',
      'Sitapur',
      'Bareilly',
      'Aligarh',
      'Moradabad',
      'Saharanpur',
      'Gorakhpur',
      'Ayodhya',
      'Jhansi',
      'Mathura',
      'Muzaffarnagar',
      'Firozabad',
      'Mirzapur',
      'Hardoi',
      'Lakhimpur Kheri',
      'Azamgarh',
      'Jaunpur',
      'Ballia',
      'Ghazipur',
      'Barabanki',
      'Unnao',
      'Rae Bareli',
      'Sultanpur',
      'Amethi',
      'Budaun',
      'Bijnor',
      'Bulandshahr',
      'Mainpuri',
      'Etawah',
      'Farrukhabad',
      'Kannauj',
      'Fatehpur',
      'Banda',
      'Hamirpur',
      'Mahoba',
      'Chitrakoot',
      'Lalitpur',
      'Basti',
      'Siddharthnagar',
      'Deoria',
      'Kushinagar',
      'Maharajganj',
      'Mau',
      'Sonbhadra',
      'Bhadohi',
      'Chandauli',
      'Gonda',
      'Bahraich',
      'Balrampur',
      'Shravasti'
    ]
  },
  'Bihar': {
    name: 'Bihar',
    code: 'BR',
    aliases: ['bihar', 'br', 'बिहार'],
    districts: [
      'Patna',
      'Gaya',
      'Muzaffarpur',
      'Bhagalpur',
      'Darbhanga',
      'Purnia',
      'Begusarai',
      'Munger',
      'Nalanda',
      'Rohtas',
      'Samastipur',
      'Vaishali',
      'Saran',
      'Siwan',
      'Gopalganj',
      'East Champaran',
      'West Champaran',
      'Sitamarhi',
      'Madhubani',
      'Katihar',
      'Saharsa',
      'Madhepura',
      'Supaul',
      'Kishanganj',
      'Araria',
      'Bhojpur',
      'Buxar',
      'Kaimur',
      'Jehanabad',
      'Arwal',
      'Aurangabad',
      'Nawada',
      'Jamui',
      'Lakhisarai',
      'Sheikhpura',
      'Khagaria',
      'Banka'
    ]
  },
  'West Bengal': {
    name: 'West Bengal',
    code: 'WB',
    aliases: ['west bengal', 'bengal', 'wb', 'পশ্চিমবঙ্গ', 'पश्चिम बंगाल'],
    districts: [
      'Kolkata',
      'North 24 Parganas',
      'South 24 Parganas',
      'Howrah',
      'Hooghly',
      'Siliguri',
      'Darjeeling',
      'Paschim Medinipur',
      'Purba Medinipur',
      'Murshidabad',
      'Nadia',
      'Paschim Bardhaman',
      'Purba Bardhaman',
      'Malda',
      'Jalpaiguri',
      'Alipurduar',
      'Cooch Behar',
      'Uttar Dinajpur',
      'Dakshin Dinajpur',
      'Birbhum',
      'Bankura',
      'Purulia',
      'Jhargram',
      'Kalimpong'
    ]
  },
  'Kerala': {
    name: 'Kerala',
    code: 'KL',
    aliases: ['kerala', 'kl', 'കേരളം', 'केरल'],
    districts: [
      'Thiruvananthapuram',
      'Kollam',
      'Pathanamthitta',
      'Alappuzha',
      'Kottayam',
      'Idukki',
      'Ernakulam',
      'Kochi',
      'Thrissur',
      'Palakkad',
      'Malappuram',
      'Kozhikode',
      'Wayanad',
      'Kannur',
      'Kasaragod'
    ]
  },
  'Odisha': {
    name: 'Odisha',
    code: 'OR',
    aliases: ['odisha', 'orissa', 'od', 'or', 'ଓଡ଼ିଶା', 'ओडिशा'],
    districts: [
      'Bhubaneswar',
      'Khordha',
      'Cuttack',
      'Ganjam',
      'Puri',
      'Balasore',
      'Bhadrak',
      'Mayurbhanj',
      'Sundargarh',
      'Rourkela',
      'Sambalpur',
      'Angul',
      'Dhenkanal',
      'Jajpur',
      'Kendrapara',
      'Jagatsinghpur',
      'Koraput',
      'Rayagada',
      'Kalahandi',
      'Balangir',
      'Bargarh',
      'Jharsuguda',
      'Keonjhar',
      'Nayagarh',
      'Kandhamal',
      'Malkangiri',
      'Nabarangpur',
      'Nuapada',
      'Subarnapur',
      'Deogarh',
      'Gajapati',
      'Boudh'
    ]
  },
  'Gujarat': {
    name: 'Gujarat',
    code: 'GJ',
    aliases: ['gujarat', 'gj', 'ગુજરાત', 'गुजरात'],
    districts: [
      'Ahmedabad',
      'Surat',
      'Vadodara',
      'Rajkot',
      'Bhavnagar',
      'Jamnagar',
      'Gandhinagar',
      'Junagadh',
      'Anand',
      'Navsari',
      'Morbi',
      'Bharuch',
      'Valsad',
      'Mehsana',
      'Kutch',
      'Patan',
      'Banaskantha',
      'Sabarkantha',
      'Panchmahal',
      'Dahod',
      'Kheda',
      'Amreli',
      'Surendranagar',
      'Porbandar',
      'Gir Somnath',
      'Botad',
      'Devbhoomi Dwarka',
      'Aravalli',
      'Mahisagar',
      'Chhota Udaipur',
      'Narmada',
      'Tapi',
      'Dang'
    ]
  },
  'Punjab': {
    name: 'Punjab',
    code: 'PB',
    aliases: ['punjab', 'pb', 'ਪੰਜਾਬ', 'पंजाब'],
    districts: [
      'Ludhiana',
      'Amritsar',
      'Jalandhar',
      'Patiala',
      'Bathinda',
      'Mohali',
      'SAS Nagar',
      'Hoshiarpur',
      'Pathankot',
      'Gurdaspur',
      'Firozpur',
      'Moga',
      'Sangrur',
      'Barnala',
      'Faridkot',
      'Muktsar',
      'Fazilka',
      'Kapurthala',
      'Fatehgarh Sahib',
      'Rupnagar',
      'Mansa',
      'Tarn Taran',
      'Nawanshahr',
      'Malerkotla'
    ]
  },
  'Haryana': {
    name: 'Haryana',
    code: 'HR',
    aliases: ['haryana', 'hr', 'हरियाणा'],
    districts: [
      'Gurugram',
      'Faridabad',
      'Panipat',
      'Ambala',
      'Karnal',
      'Hisar',
      'Rohtak',
      'Sonipat',
      'Panchkula',
      'Yamunanagar',
      'Sirsa',
      'Bhiwani',
      'Rewari',
      'Jhajjar',
      'Kaithal',
      'Kurukshetra',
      'Palwal',
      'Fatehabad',
      'Mahendragarh',
      'Jind',
      'Nuh',
      'Charkhi Dadri'
    ]
  },
  'Madhya Pradesh': {
    name: 'Madhya Pradesh',
    code: 'MP',
    aliases: ['madhya pradesh', 'mp', 'मध्य प्रदेश', 'एमपी'],
    districts: [
      'Indore',
      'Bhopal',
      'Jabalpur',
      'Gwalior',
      'Ujjain',
      'Sagar',
      'Dewas',
      'Satna',
      'Ratlam',
      'Rewa',
      'Murwara',
      'Singrauli',
      'Burhanpur',
      'Khandwa',
      'Morena',
      'Bhind',
      'Chhindwara',
      'Guna',
      'Shivpuri',
      'Vidisha',
      'Chhatarpur',
      'Damoh',
      'Mandsaur',
      'Khargone',
      'Neemuch',
      'Pithampur',
      'Sehore',
      'Hoshangabad',
      'Narmadapuram',
      'Betul',
      'Seoni',
      'Datia',
      'Nagda'
    ]
  },
  'Delhi': {
    name: 'Delhi',
    code: 'DL',
    aliases: ['delhi', 'new delhi', 'ncr', 'dl', 'दिल्ली', 'नई दिल्ली'],
    districts: [
      'Central Delhi',
      'East Delhi',
      'New Delhi',
      'North Delhi',
      'North East Delhi',
      'North West Delhi',
      'Shahdara',
      'South Delhi',
      'South East Delhi',
      'South West Delhi',
      'West Delhi'
    ]
  },
  'Assam': {
    name: 'Assam',
    code: 'AS',
    aliases: ['assam', 'as', 'অসম', 'असम'],
    districts: [
      'Guwahati',
      'Kamrup Metropolitan',
      'Kamrup',
      'Dibrugarh',
      'Silchar',
      'Cachar',
      'Jorhat',
      'Nagaon',
      'Tinsukia',
      'Tezpur',
      'Sonitpur',
      'Barpeta',
      'Bongaigaon',
      'Dhubri',
      'Golaghat',
      'Sivasagar',
      'Lakhimpur',
      'Darrang',
      'Morigaon',
      'Goalpara',
      'Karimganj',
      'Hailakandi',
      'Kokrajhar',
      'Nalbari',
      'Dhemaji',
      'Karbi Anglong',
      'Dima Hasao'
    ]
  }
};

// District Coordinates Centroid Master Dictionary
export const DISTRICT_COORDINATES: Record<string, { latitude: number; longitude: number; state: string }> = {
  // Tamil Nadu
  'Theni': { latitude: 10.0104, longitude: 77.4768, state: 'Tamil Nadu' },
  'Madurai': { latitude: 9.9252, longitude: 78.1198, state: 'Tamil Nadu' },
  'Dindigul': { latitude: 10.3673, longitude: 77.9803, state: 'Tamil Nadu' },
  'Coimbatore': { latitude: 11.0168, longitude: 76.9558, state: 'Tamil Nadu' },
  'Tiruppur': { latitude: 11.1085, longitude: 77.3411, state: 'Tamil Nadu' },
  'Chennai': { latitude: 13.0827, longitude: 80.2707, state: 'Tamil Nadu' },
  'Salem': { latitude: 11.6643, longitude: 78.1460, state: 'Tamil Nadu' },
  'Erode': { latitude: 11.3410, longitude: 77.7172, state: 'Tamil Nadu' },
  'Tiruchirappalli': { latitude: 10.7905, longitude: 78.7047, state: 'Tamil Nadu' },
  'Tirunelveli': { latitude: 8.7139, longitude: 77.7567, state: 'Tamil Nadu' },
  'Vellore': { latitude: 12.9165, longitude: 79.1325, state: 'Tamil Nadu' },
  'Thoothukudi': { latitude: 8.7642, longitude: 78.1348, state: 'Tamil Nadu' },
  'Thanjavur': { latitude: 10.7870, longitude: 79.1378, state: 'Tamil Nadu' },
  'Kanchipuram': { latitude: 12.8342, longitude: 79.7036, state: 'Tamil Nadu' },
  'Chengalpattu': { latitude: 12.6819, longitude: 79.9888, state: 'Tamil Nadu' },
  'Cuddalore': { latitude: 11.7480, longitude: 79.7714, state: 'Tamil Nadu' },
  'Villupuram': { latitude: 11.9401, longitude: 79.4861, state: 'Tamil Nadu' },
  'Nagapattinam': { latitude: 10.7672, longitude: 79.8449, state: 'Tamil Nadu' },
  'Kanniyakumari': { latitude: 8.0883, longitude: 77.5385, state: 'Tamil Nadu' },
  'Karur': { latitude: 10.9601, longitude: 78.0766, state: 'Tamil Nadu' },
  'Namakkal': { latitude: 11.2189, longitude: 78.1674, state: 'Tamil Nadu' },
  'Dharmapuri': { latitude: 12.1211, longitude: 78.1582, state: 'Tamil Nadu' },
  'Krishnagiri': { latitude: 12.5186, longitude: 78.2137, state: 'Tamil Nadu' },
  'Pudukkottai': { latitude: 10.3797, longitude: 78.8208, state: 'Tamil Nadu' },
  'Ramanathapuram': { latitude: 9.3639, longitude: 78.8395, state: 'Tamil Nadu' },
  'Sivaganga': { latitude: 9.8433, longitude: 78.4809, state: 'Tamil Nadu' },
  'Virudhunagar': { latitude: 9.5872, longitude: 77.9514, state: 'Tamil Nadu' },
  'Nilgiris': { latitude: 11.4102, longitude: 76.6950, state: 'Tamil Nadu' },
  'Perambalur': { latitude: 11.2342, longitude: 78.8820, state: 'Tamil Nadu' },
  'Ariyalur': { latitude: 11.1401, longitude: 79.0786, state: 'Tamil Nadu' },
  'Tiruvarur': { latitude: 10.7725, longitude: 79.6365, state: 'Tamil Nadu' },
  'Tiruvannamalai': { latitude: 12.2253, longitude: 79.0747, state: 'Tamil Nadu' },
  'Ranipet': { latitude: 12.9279, longitude: 79.3330, state: 'Tamil Nadu' },
  'Tirupathur': { latitude: 12.4958, longitude: 78.5678, state: 'Tamil Nadu' },
  'Tenkasi': { latitude: 8.9594, longitude: 77.3161, state: 'Tamil Nadu' },
  'Mayiladuthurai': { latitude: 11.1075, longitude: 79.6524, state: 'Tamil Nadu' },
  'Kallakurichi': { latitude: 11.7384, longitude: 78.9639, state: 'Tamil Nadu' },

  // Karnataka
  'Bengaluru Urban': { latitude: 12.9716, longitude: 77.5946, state: 'Karnataka' },
  'Bengaluru': { latitude: 12.9716, longitude: 77.5946, state: 'Karnataka' },
  'Bengaluru Rural': { latitude: 13.2847, longitude: 77.5540, state: 'Karnataka' },
  'Mysuru': { latitude: 12.2958, longitude: 76.6394, state: 'Karnataka' },
  'Hubballi-Dharwad': { latitude: 15.3647, longitude: 75.1240, state: 'Karnataka' },
  'Dharwad': { latitude: 15.4589, longitude: 75.0078, state: 'Karnataka' },
  'Belagavi': { latitude: 15.8497, longitude: 74.4977, state: 'Karnataka' },
  'Kalaburagi': { latitude: 17.3297, longitude: 76.8343, state: 'Karnataka' },
  'Mangaluru': { latitude: 12.9141, longitude: 74.8560, state: 'Karnataka' },
  'Dakshina Kannada': { latitude: 12.8703, longitude: 75.2479, state: 'Karnataka' },
  'Udupi': { latitude: 13.3409, longitude: 74.7421, state: 'Karnataka' },
  'Ballari': { latitude: 15.1394, longitude: 76.9214, state: 'Karnataka' },
  'Shivamogga': { latitude: 13.9299, longitude: 75.5681, state: 'Karnataka' },
  'Tumakuru': { latitude: 13.3379, longitude: 77.1010, state: 'Karnataka' },
  'Davangere': { latitude: 14.4644, longitude: 75.9218, state: 'Karnataka' },
  'Hassan': { latitude: 13.0072, longitude: 76.0963, state: 'Karnataka' },
  'Bidar': { latitude: 17.9104, longitude: 77.5199, state: 'Karnataka' },
  'Vijayapura': { latitude: 16.8302, longitude: 75.7100, state: 'Karnataka' },
  'Raichur': { latitude: 16.2120, longitude: 77.3439, state: 'Karnataka' },
  'Chikkamagaluru': { latitude: 13.3161, longitude: 75.7720, state: 'Karnataka' },
  'Mandya': { latitude: 12.5244, longitude: 76.8958, state: 'Karnataka' },
  'Kolar': { latitude: 13.1358, longitude: 78.1329, state: 'Karnataka' },
  'Chamarajanagar': { latitude: 11.9261, longitude: 76.9437, state: 'Karnataka' },
  'Koppal': { latitude: 15.3533, longitude: 76.1557, state: 'Karnataka' },
  'Bagalkote': { latitude: 16.1691, longitude: 75.6615, state: 'Karnataka' },
  'Gadag': { latitude: 15.4294, longitude: 75.6310, state: 'Karnataka' },
  'Haveri': { latitude: 14.7972, longitude: 75.3995, state: 'Karnataka' },
  'Uttara Kannada': { latitude: 14.7952, longitude: 74.6869, state: 'Karnataka' },
  'Yadgir': { latitude: 16.7639, longitude: 77.1378, state: 'Karnataka' },
  'Chitradurga': { latitude: 14.2251, longitude: 76.3980, state: 'Karnataka' },
  'Ramanagara': { latitude: 12.7150, longitude: 77.2810, state: 'Karnataka' },
  'Kodagu': { latitude: 12.3375, longitude: 75.8069, state: 'Karnataka' },

  // Andhra Pradesh
  'Visakhapatnam': { latitude: 17.6868, longitude: 83.2185, state: 'Andhra Pradesh' },
  'Vijayawada': { latitude: 16.5062, longitude: 80.6480, state: 'Andhra Pradesh' },
  'Krishna': { latitude: 16.1809, longitude: 81.1303, state: 'Andhra Pradesh' },
  'Guntur': { latitude: 16.3067, longitude: 80.4365, state: 'Andhra Pradesh' },
  'Vizianagaram': { latitude: 18.1067, longitude: 83.3956, state: 'Andhra Pradesh' },
  'Tirupati': { latitude: 13.6288, longitude: 79.4192, state: 'Andhra Pradesh' },
  'Chittoor': { latitude: 13.2172, longitude: 79.1003, state: 'Andhra Pradesh' },
  'Srikakulam': { latitude: 18.2949, longitude: 83.8938, state: 'Andhra Pradesh' },
  'East Godavari': { latitude: 17.0005, longitude: 81.8040, state: 'Andhra Pradesh' },
  'West Godavari': { latitude: 16.7107, longitude: 81.0952, state: 'Andhra Pradesh' },
  'Kakinada': { latitude: 16.9891, longitude: 82.2475, state: 'Andhra Pradesh' },
  'Nellore': { latitude: 14.4426, longitude: 79.9865, state: 'Andhra Pradesh' },
  'Kurnool': { latitude: 15.8281, longitude: 78.0373, state: 'Andhra Pradesh' },
  'Ananthapuramu': { latitude: 14.6819, longitude: 77.6006, state: 'Andhra Pradesh' },
  'YSR Kadapa': { latitude: 14.4673, longitude: 78.8242, state: 'Andhra Pradesh' },
  'Prakasam': { latitude: 15.5057, longitude: 80.0499, state: 'Andhra Pradesh' },

  // Telangana
  'Hyderabad': { latitude: 17.3850, longitude: 78.4867, state: 'Telangana' },
  'Warangal': { latitude: 17.9689, longitude: 79.5941, state: 'Telangana' },
  'Hanamkonda': { latitude: 18.0138, longitude: 79.5519, state: 'Telangana' },
  'Nizamabad': { latitude: 18.6725, longitude: 78.0941, state: 'Telangana' },
  'Karimnagar': { latitude: 18.4386, longitude: 79.1288, state: 'Telangana' },
  'Khammam': { latitude: 17.2473, longitude: 80.1514, state: 'Telangana' },
  'Ranga Reddy': { latitude: 17.3000, longitude: 78.3000, state: 'Telangana' },
  'Medchal-Malkajgiri': { latitude: 17.6297, longitude: 78.4814, state: 'Telangana' },
  'Sangareddy': { latitude: 17.6191, longitude: 78.0817, state: 'Telangana' },
  'Nalgonda': { latitude: 17.0575, longitude: 79.2684, state: 'Telangana' },
  'Mahabubnagar': { latitude: 16.7488, longitude: 77.9856, state: 'Telangana' },
  'Siddipet': { latitude: 18.1018, longitude: 78.8520, state: 'Telangana' },

  // Maharashtra
  'Pune': { latitude: 18.5204, longitude: 73.8567, state: 'Maharashtra' },
  'Mumbai City': { latitude: 18.9220, longitude: 72.8347, state: 'Maharashtra' },
  'Mumbai Suburban': { latitude: 19.0760, longitude: 72.8777, state: 'Maharashtra' },
  'Mumbai': { latitude: 19.0760, longitude: 72.8777, state: 'Maharashtra' },
  'Nagpur': { latitude: 21.1458, longitude: 79.0882, state: 'Maharashtra' },
  'Nashik': { latitude: 20.0059, longitude: 73.7910, state: 'Maharashtra' },
  'Solapur': { latitude: 17.6599, longitude: 75.9064, state: 'Maharashtra' },
  'Thane': { latitude: 19.2183, longitude: 72.9781, state: 'Maharashtra' },
  'Aurangabad': { latitude: 19.8762, longitude: 75.3433, state: 'Maharashtra' },
  'Chhatrapati Sambhajinagar': { latitude: 19.8762, longitude: 75.3433, state: 'Maharashtra' },
  'Kolhapur': { latitude: 16.7050, longitude: 74.2433, state: 'Maharashtra' },
  'Amravati': { latitude: 20.9320, longitude: 77.7523, state: 'Maharashtra' },
  'Navi Mumbai': { latitude: 19.0330, longitude: 73.0297, state: 'Maharashtra' },
  'Sangli': { latitude: 16.8524, longitude: 74.5815, state: 'Maharashtra' },
  'Jalgaon': { latitude: 21.0077, longitude: 75.5626, state: 'Maharashtra' },
  'Satara': { latitude: 17.6805, longitude: 74.0183, state: 'Maharashtra' },
  'Ahmednagar': { latitude: 19.0948, longitude: 74.7480, state: 'Maharashtra' },
  'Latur': { latitude: 18.4088, longitude: 76.5604, state: 'Maharashtra' },

  // Rajasthan
  'Jaipur': { latitude: 26.9124, longitude: 75.7873, state: 'Rajasthan' },
  'Jodhpur': { latitude: 26.2389, longitude: 73.0243, state: 'Rajasthan' },
  'Udaipur': { latitude: 24.5854, longitude: 73.7125, state: 'Rajasthan' },
  'Kota': { latitude: 25.2138, longitude: 75.8648, state: 'Rajasthan' },
  'Ajmer': { latitude: 26.4499, longitude: 74.6399, state: 'Rajasthan' },
  'Bikaner': { latitude: 28.0229, longitude: 73.3119, state: 'Rajasthan' },
  'Bhilwara': { latitude: 25.3463, longitude: 74.6364, state: 'Rajasthan' },
  'Alwar': { latitude: 27.5530, longitude: 76.6346, state: 'Rajasthan' },
  'Bharatpur': { latitude: 27.2152, longitude: 77.5030, state: 'Rajasthan' },
  'Sikar': { latitude: 27.6094, longitude: 75.1398, state: 'Rajasthan' },
  'Pali': { latitude: 25.7711, longitude: 73.3234, state: 'Rajasthan' },

  // Uttar Pradesh
  'Lucknow': { latitude: 26.8467, longitude: 80.9462, state: 'Uttar Pradesh' },
  'Varanasi': { latitude: 25.3176, longitude: 82.9739, state: 'Uttar Pradesh' },
  'Sitapur': { latitude: 27.5684, longitude: 80.6829, state: 'Uttar Pradesh' },
  'Kanpur Nagar': { latitude: 26.4499, longitude: 80.3319, state: 'Uttar Pradesh' },
  'Kanpur': { latitude: 26.4499, longitude: 80.3319, state: 'Uttar Pradesh' },
  'Prayagraj': { latitude: 25.4358, longitude: 81.8463, state: 'Uttar Pradesh' },
  'Allahabad': { latitude: 25.4358, longitude: 81.8463, state: 'Uttar Pradesh' },
  'Agra': { latitude: 27.1767, longitude: 78.0081, state: 'Uttar Pradesh' },
  'Noida': { latitude: 28.5355, longitude: 77.3910, state: 'Uttar Pradesh' },
  'Gautam Buddha Nagar': { latitude: 28.5355, longitude: 77.3910, state: 'Uttar Pradesh' },
  'Ghaziabad': { latitude: 28.6692, longitude: 77.4538, state: 'Uttar Pradesh' },
  'Meerut': { latitude: 28.9845, longitude: 77.7064, state: 'Uttar Pradesh' },
  'Gorakhpur': { latitude: 26.7606, longitude: 83.3732, state: 'Uttar Pradesh' },
  'Ayodhya': { latitude: 26.7922, longitude: 82.1998, state: 'Uttar Pradesh' },
  'Jhansi': { latitude: 25.4484, longitude: 78.5685, state: 'Uttar Pradesh' },
  'Mathura': { latitude: 27.4924, longitude: 77.6737, state: 'Uttar Pradesh' },
  'Bareilly': { latitude: 28.3670, longitude: 79.4304, state: 'Uttar Pradesh' },
  'Aligarh': { latitude: 27.8974, longitude: 78.0880, state: 'Uttar Pradesh' },

  // Bihar
  'Patna': { latitude: 25.5941, longitude: 85.1376, state: 'Bihar' },
  'Gaya': { latitude: 24.7955, longitude: 84.9994, state: 'Bihar' },
  'Muzaffarpur': { latitude: 26.1209, longitude: 85.3647, state: 'Bihar' },
  'Bhagalpur': { latitude: 25.2425, longitude: 86.9842, state: 'Bihar' },
  'Darbhanga': { latitude: 26.1542, longitude: 85.8918, state: 'Bihar' },
  'Purnia': { latitude: 25.7771, longitude: 87.4753, state: 'Bihar' },
  'Begusarai': { latitude: 25.4182, longitude: 86.1272, state: 'Bihar' },
  'Nalanda': { latitude: 25.1982, longitude: 85.5149, state: 'Bihar' },

  // West Bengal
  'Kolkata': { latitude: 22.5726, longitude: 88.3639, state: 'West Bengal' },
  'Howrah': { latitude: 22.5958, longitude: 88.2636, state: 'West Bengal' },
  'Siliguri': { latitude: 26.7271, longitude: 88.3953, state: 'West Bengal' },
  'Darjeeling': { latitude: 27.0410, longitude: 88.2663, state: 'West Bengal' },
  'North 24 Parganas': { latitude: 22.7185, longitude: 88.4799, state: 'West Bengal' },
  'South 24 Parganas': { latitude: 22.1352, longitude: 88.5492, state: 'West Bengal' },
  'Hooghly': { latitude: 22.9030, longitude: 88.3968, state: 'West Bengal' },

  // Kerala
  'Thiruvananthapuram': { latitude: 8.5241, longitude: 76.9366, state: 'Kerala' },
  'Kochi': { latitude: 9.9312, longitude: 76.2673, state: 'Kerala' },
  'Ernakulam': { latitude: 9.9816, longitude: 76.2999, state: 'Kerala' },
  'Kozhikode': { latitude: 11.2588, longitude: 75.7804, state: 'Kerala' },
  'Thrissur': { latitude: 10.5276, longitude: 76.2144, state: 'Kerala' },
  'Kollam': { latitude: 8.8932, longitude: 76.6141, state: 'Kerala' },
  'Kannur': { latitude: 11.8745, longitude: 75.3704, state: 'Kerala' },

  // Odisha
  'Bhubaneswar': { latitude: 20.2961, longitude: 85.8245, state: 'Odisha' },
  'Cuttack': { latitude: 20.4625, longitude: 85.8828, state: 'Odisha' },
  'Puri': { latitude: 19.8135, longitude: 85.8312, state: 'Odisha' },
  'Rourkela': { latitude: 22.2604, longitude: 84.8536, state: 'Odisha' },
  'Sambalpur': { latitude: 21.4669, longitude: 83.9812, state: 'Odisha' },
  'Khordha': { latitude: 20.1812, longitude: 85.6179, state: 'Odisha' },

  // Gujarat
  'Ahmedabad': { latitude: 23.0225, longitude: 72.5714, state: 'Gujarat' },
  'Surat': { latitude: 21.1702, longitude: 72.8311, state: 'Gujarat' },
  'Vadodara': { latitude: 22.3072, longitude: 73.1812, state: 'Gujarat' },
  'Rajkot': { latitude: 22.3039, longitude: 70.8022, state: 'Gujarat' },
  'Gandhinagar': { latitude: 23.2156, longitude: 72.6369, state: 'Gujarat' },

  // Punjab
  'Ludhiana': { latitude: 30.9010, longitude: 75.8573, state: 'Punjab' },
  'Amritsar': { latitude: 31.6340, longitude: 74.8723, state: 'Punjab' },
  'Jalandhar': { latitude: 31.3260, longitude: 75.5762, state: 'Punjab' },
  'Patiala': { latitude: 30.3398, longitude: 76.3869, state: 'Punjab' },

  // Haryana
  'Gurugram': { latitude: 28.4595, longitude: 77.0266, state: 'Haryana' },
  'Faridabad': { latitude: 28.4089, longitude: 77.3178, state: 'Haryana' },
  'Panipat': { latitude: 29.3909, longitude: 76.9635, state: 'Haryana' },

  // Madhya Pradesh
  'Indore': { latitude: 22.7196, longitude: 75.8577, state: 'Madhya Pradesh' },
  'Bhopal': { latitude: 23.2599, longitude: 77.4126, state: 'Madhya Pradesh' },
  'Gwalior': { latitude: 26.2183, longitude: 78.1828, state: 'Madhya Pradesh' },
  'Jabalpur': { latitude: 23.1815, longitude: 79.9864, state: 'Madhya Pradesh' },

  // Delhi
  'New Delhi': { latitude: 28.6139, longitude: 77.2090, state: 'Delhi' },
  'Central Delhi': { latitude: 28.6448, longitude: 77.2167, state: 'Delhi' },
  'South Delhi': { latitude: 28.4817, longitude: 77.1873, state: 'Delhi' },

  // Assam
  'Guwahati': { latitude: 26.1445, longitude: 91.7362, state: 'Assam' },
  'Kamrup Metropolitan': { latitude: 26.1445, longitude: 91.7362, state: 'Assam' },
  'Dibrugarh': { latitude: 27.4728, longitude: 94.9120, state: 'Assam' },
  'Silchar': { latitude: 24.8333, longitude: 92.7789, state: 'Assam' }
};

// State Aliases Mapping for Voice & Text Normalization
const STATE_ALIASES: Record<string, string> = {
  'tn': 'Tamil Nadu',
  'tamil nadu': 'Tamil Nadu',
  'tamilnadu': 'Tamil Nadu',
  'tamil nad': 'Tamil Nadu',
  'தமிழ்நாடு': 'Tamil Nadu',
  'தமிழ் நாடு': 'Tamil Nadu',
  'तमिलनाडु': 'Tamil Nadu',

  'ka': 'Karnataka',
  'kar': 'Karnataka',
  'karnataka': 'Karnataka',
  'ಕರ್ನಾಟಕ': 'Karnataka',
  'कर्नाटक': 'Karnataka',

  'ap': 'Andhra Pradesh',
  'andhra pradesh': 'Andhra Pradesh',
  'andhra': 'Andhra Pradesh',
  'ఆంధ్ర ప్రదేశ్': 'Andhra Pradesh',
  'ఆంధ్రప్రదేశ్': 'Andhra Pradesh',
  'आंध्र प्रदेश': 'Andhra Pradesh',

  'ts': 'Telangana',
  'tg': 'Telangana',
  'telangana': 'Telangana',
  'తెలంగాణ': 'Telangana',
  'तेलंगाना': 'Telangana',

  'mh': 'Maharashtra',
  'maha': 'Maharashtra',
  'maharashtra': 'Maharashtra',
  'महाराष्ट्र': 'Maharashtra',

  'rj': 'Rajasthan',
  'raj': 'Rajasthan',
  'rajasthan': 'Rajasthan',
  'राजस्थान': 'Rajasthan',

  'up': 'Uttar Pradesh',
  'uttar pradesh': 'Uttar Pradesh',
  'उत्तर प्रदेश': 'Uttar Pradesh',
  'यूपी': 'Uttar Pradesh',

  'br': 'Bihar',
  'bihar': 'Bihar',
  'बिहार': 'Bihar',

  'wb': 'West Bengal',
  'west bengal': 'West Bengal',
  'bengal': 'West Bengal',
  'পশ্চিমবঙ্গ': 'West Bengal',
  'पश्चिम बंगाल': 'West Bengal',

  'kl': 'Kerala',
  'kerala': 'Kerala',
  'കേരളം': 'Kerala',
  'केरल': 'Kerala',

  'od': 'Odisha',
  'or': 'Odisha',
  'orissa': 'Odisha',
  'odisha': 'Odisha',
  'ଓଡ଼ିଶା': 'Odisha',
  'ओडिशा': 'Odisha',

  'gj': 'Gujarat',
  'gujarat': 'Gujarat',
  'ગુજરાત': 'Gujarat',
  'गुजरात': 'Gujarat',

  'pb': 'Punjab',
  'punjab': 'Punjab',
  'ਪੰਜਾਬ': 'Punjab',
  'पंजाब': 'Punjab',

  'hr': 'Haryana',
  'haryana': 'Haryana',
  'हरियाणा': 'Haryana',

  'mp': 'Madhya Pradesh',
  'madhya pradesh': 'Madhya Pradesh',
  'मध्य प्रदेश': 'Madhya Pradesh',
  'एमपी': 'Madhya Pradesh',

  'dl': 'Delhi',
  'delhi': 'Delhi',
  'new delhi': 'Delhi',
  'ncr': 'Delhi',
  'दिल्ली': 'Delhi',
  'नई दिल्ली': 'Delhi',

  'as': 'Assam',
  'assam': 'Assam',
  'অসম': 'Assam',
  'असम': 'Assam'
};

// District Aliases / Regional Language Mapping
const DISTRICT_ALIASES: Record<string, { district: string; state: string }> = {
  // Tamil Nadu
  'theni': { district: 'Theni', state: 'Tamil Nadu' },
  'theni dist': { district: 'Theni', state: 'Tamil Nadu' },
  'theni district': { district: 'Theni', state: 'Tamil Nadu' },
  'தேனி': { district: 'Theni', state: 'Tamil Nadu' },
  'தேனி மாவட்டம்': { district: 'Theni', state: 'Tamil Nadu' },

  'chennai': { district: 'Chennai', state: 'Tamil Nadu' },
  'chennai dist': { district: 'Chennai', state: 'Tamil Nadu' },
  'chennai district': { district: 'Chennai', state: 'Tamil Nadu' },
  'madras': { district: 'Chennai', state: 'Tamil Nadu' },
  'சென்னை': { district: 'Chennai', state: 'Tamil Nadu' },
  'சென்னை மாவட்டம்': { district: 'Chennai', state: 'Tamil Nadu' },

  'madurai': { district: 'Madurai', state: 'Tamil Nadu' },
  'மதுரை': { district: 'Madurai', state: 'Tamil Nadu' },

  'coimbatore': { district: 'Coimbatore', state: 'Tamil Nadu' },
  'kovai': { district: 'Coimbatore', state: 'Tamil Nadu' },
  'கோயம்புத்தூர்': { district: 'Coimbatore', state: 'Tamil Nadu' },
  'கோவை': { district: 'Coimbatore', state: 'Tamil Nadu' },

  'salem': { district: 'Salem', state: 'Tamil Nadu' },
  'சேலம்': { district: 'Salem', state: 'Tamil Nadu' },

  'dindigul': { district: 'Dindigul', state: 'Tamil Nadu' },
  'திண்டுக்கல்': { district: 'Dindigul', state: 'Tamil Nadu' },

  'tiruppur': { district: 'Tiruppur', state: 'Tamil Nadu' },
  'திருப்பூர்': { district: 'Tiruppur', state: 'Tamil Nadu' },

  'tiruchirappalli': { district: 'Tiruchirappalli', state: 'Tamil Nadu' },
  'trichy': { district: 'Tiruchirappalli', state: 'Tamil Nadu' },
  'திருச்சி': { district: 'Tiruchirappalli', state: 'Tamil Nadu' },

  'tirunelveli': { district: 'Tirunelveli', state: 'Tamil Nadu' },
  'nellai': { district: 'Tirunelveli', state: 'Tamil Nadu' },
  'திருநெல்வேலி': { district: 'Tirunelveli', state: 'Tamil Nadu' },

  'erode': { district: 'Erode', state: 'Tamil Nadu' },
  'ஈரோடு': { district: 'Erode', state: 'Tamil Nadu' },

  'vellore': { district: 'Vellore', state: 'Tamil Nadu' },
  'வேலூர்': { district: 'Vellore', state: 'Tamil Nadu' },

  'thoothukudi': { district: 'Thoothukudi', state: 'Tamil Nadu' },
  'tuticorin': { district: 'Thoothukudi', state: 'Tamil Nadu' },
  'தூத்துக்குடி': { district: 'Thoothukudi', state: 'Tamil Nadu' },

  // Andhra Pradesh
  'vizianagaram': { district: 'Vizianagaram', state: 'Andhra Pradesh' },
  'విజయనగరం': { district: 'Vizianagaram', state: 'Andhra Pradesh' },

  'visakhapatnam': { district: 'Visakhapatnam', state: 'Andhra Pradesh' },
  'vizag': { district: 'Visakhapatnam', state: 'Andhra Pradesh' },
  'విశాఖపట్నం': { district: 'Visakhapatnam', state: 'Andhra Pradesh' },

  'vijayawada': { district: 'Vijayawada', state: 'Andhra Pradesh' },
  'విజయవాడ': { district: 'Vijayawada', state: 'Andhra Pradesh' },

  'guntur': { district: 'Guntur', state: 'Andhra Pradesh' },
  'గుంటూరు': { district: 'Guntur', state: 'Andhra Pradesh' },

  'tirupati': { district: 'Tirupati', state: 'Andhra Pradesh' },
  'తిరుపతి': { district: 'Tirupati', state: 'Andhra Pradesh' },

  // Telangana
  'hyderabad': { district: 'Hyderabad', state: 'Telangana' },
  'హైదరాబాద్': { district: 'Hyderabad', state: 'Telangana' },
  'warangal': { district: 'Warangal', state: 'Telangana' },
  'వరంగల్': { district: 'Warangal', state: 'Telangana' },
  'nizamabad': { district: 'Nizamabad', state: 'Telangana' },
  'నిజామాబాద్': { district: 'Nizamabad', state: 'Telangana' },

  // Karnataka
  'bengaluru': { district: 'Bengaluru Urban', state: 'Karnataka' },
  'bengaluru urban': { district: 'Bengaluru Urban', state: 'Karnataka' },
  'bangalore': { district: 'Bengaluru Urban', state: 'Karnataka' },
  'ಬೆಂಗಳೂರು': { district: 'Bengaluru Urban', state: 'Karnataka' },

  'mysuru': { district: 'Mysuru', state: 'Karnataka' },
  'mysore': { district: 'Mysuru', state: 'Karnataka' },
  'ಮೈಸೂರು': { district: 'Mysuru', state: 'Karnataka' },

  'hubballi': { district: 'Hubballi-Dharwad', state: 'Karnataka' },
  'hubli': { district: 'Hubballi-Dharwad', state: 'Karnataka' },
  'dharwad': { district: 'Dharwad', state: 'Karnataka' },
  'ಹುಬ್ಬಳ್ಳಿ': { district: 'Hubballi-Dharwad', state: 'Karnataka' },

  // Maharashtra
  'pune': { district: 'Pune', state: 'Maharashtra' },
  'पुणे': { district: 'Pune', state: 'Maharashtra' },

  'mumbai': { district: 'Mumbai Suburban', state: 'Maharashtra' },
  'bombay': { district: 'Mumbai Suburban', state: 'Maharashtra' },
  'मुंबई': { district: 'Mumbai Suburban', state: 'Maharashtra' },

  'nagpur': { district: 'Nagpur', state: 'Maharashtra' },
  'नागपूर': { district: 'Nagpur', state: 'Maharashtra' },
  'नागपुर': { district: 'Nagpur', state: 'Maharashtra' },

  'nashik': { district: 'Nashik', state: 'Maharashtra' },
  'नासिक': { district: 'Nashik', state: 'Maharashtra' },

  'solapur': { district: 'Solapur', state: 'Maharashtra' },
  'sholapur': { district: 'Solapur', state: 'Maharashtra' },
  'सोलापूर': { district: 'Solapur', state: 'Maharashtra' },
  'सोलापुर': { district: 'Solapur', state: 'Maharashtra' },

  // Rajasthan
  'jaipur': { district: 'Jaipur', state: 'Rajasthan' },
  'जयपुर': { district: 'Jaipur', state: 'Rajasthan' },
  'jodhpur': { district: 'Jodhpur', state: 'Rajasthan' },
  'जोधपुर': { district: 'Jodhpur', state: 'Rajasthan' },
  'udaipur': { district: 'Udaipur', state: 'Rajasthan' },
  'उदयपुर': { district: 'Udaipur', state: 'Rajasthan' },
  'kota': { district: 'Kota', state: 'Rajasthan' },
  'कोटा': { district: 'Kota', state: 'Rajasthan' },

  // Uttar Pradesh
  'lucknow': { district: 'Lucknow', state: 'Uttar Pradesh' },
  'लखनऊ': { district: 'Lucknow', state: 'Uttar Pradesh' },

  'varanasi': { district: 'Varanasi', state: 'Uttar Pradesh' },
  'banaras': { district: 'Varanasi', state: 'Uttar Pradesh' },
  'kashi': { district: 'Varanasi', state: 'Uttar Pradesh' },
  'वाराणसी': { district: 'Varanasi', state: 'Uttar Pradesh' },
  'बनारस': { district: 'Varanasi', state: 'Uttar Pradesh' },

  'sitapur': { district: 'Sitapur', state: 'Uttar Pradesh' },
  'सीतापुर': { district: 'Sitapur', state: 'Uttar Pradesh' },

  'kanpur': { district: 'Kanpur Nagar', state: 'Uttar Pradesh' },
  'कानपुर': { district: 'Kanpur Nagar', state: 'Uttar Pradesh' },

  'noida': { district: 'Noida', state: 'Uttar Pradesh' },
  'नोएडा': { district: 'Noida', state: 'Uttar Pradesh' },

  // Bihar
  'patna': { district: 'Patna', state: 'Bihar' },
  'पटना': { district: 'Patna', state: 'Bihar' },
  'gaya': { district: 'Gaya', state: 'Bihar' },
  'गया': { district: 'Gaya', state: 'Bihar' },
  'muzaffarpur': { district: 'Muzaffarpur', state: 'Bihar' },
  'मुजफ्फरपुर': { district: 'Muzaffarpur', state: 'Bihar' },

  // West Bengal
  'kolkata': { district: 'Kolkata', state: 'West Bengal' },
  'calcutta': { district: 'Kolkata', state: 'West Bengal' },
  'কলকাতা': { district: 'Kolkata', state: 'West Bengal' },
  'कोलकाता': { district: 'Kolkata', state: 'West Bengal' },
  'siliguri': { district: 'Siliguri', state: 'West Bengal' },

  // Kerala
  'kochi': { district: 'Kochi', state: 'Kerala' },
  'cochin': { district: 'Kochi', state: 'Kerala' },
  'ernakulam': { district: 'Ernakulam', state: 'Kerala' },
  'കൊച്ചി': { district: 'Kochi', state: 'Kerala' },
  'thiruvananthapuram': { district: 'Thiruvananthapuram', state: 'Kerala' },
  'trivandrum': { district: 'Thiruvananthapuram', state: 'Kerala' },
  'തിരുവനന്തപുരം': { district: 'Thiruvananthapuram', state: 'Kerala' },

  // Odisha
  'bhubaneswar': { district: 'Bhubaneswar', state: 'Odisha' },
  'ଭୁବନେଶ୍ୱର': { district: 'Bhubaneswar', state: 'Odisha' },
  'भुवनेश्वर': { district: 'Bhubaneswar', state: 'Odisha' },
  'cuttack': { district: 'Cuttack', state: 'Odisha' }
};

/**
 * Returns all recognized Indian States
 */
export function getAllStates(): string[] {
  return Object.keys(INDIA_STATES_DISTRICTS);
}

/**
 * Returns all districts belonging to a specific state
 */
export function getDistrictsForState(stateName: string): string[] {
  const normState = normalizeStateName(stateName);
  if (!normState || !INDIA_STATES_DISTRICTS[normState]) {
    return [];
  }
  return INDIA_STATES_DISTRICTS[normState].districts;
}

/**
 * Normalizes state name from voice, colloquial, or regional script
/**
 * Normalizes state name to its canonical English form
 */
export function normalizeStateName(input?: string): string {
  if (!input) return '';
  const clean = input.toLowerCase().trim();

  // Direct lookup in alias table
  if (STATE_ALIASES[clean]) {
    return STATE_ALIASES[clean];
  }

  // Exact or partial match with master states
  for (const stateName of Object.keys(INDIA_STATES_DISTRICTS)) {
    const sInfo = INDIA_STATES_DISTRICTS[stateName];
    if (
      clean === stateName.toLowerCase() ||
      clean === sInfo.code.toLowerCase() ||
      sInfo.aliases.some((a) => clean === a.toLowerCase() || clean.includes(a.toLowerCase()) || a.toLowerCase().includes(clean))
    ) {
      return stateName;
    }
  }

  // Substring match
  for (const [alias, canonical] of Object.entries(STATE_ALIASES)) {
    if (clean.includes(alias) || alias.includes(clean)) {
      return canonical;
    }
  }

  return input.trim();
}

/**
 * Returns full district and state info
 */
export function getDistrictInfo(districtInput?: string, stateContext?: string): { district: string; state: string } | null {
  if (!districtInput) return null;
  const clean = districtInput
    .toLowerCase()
    .trim()
    .replace(/\b(district|dist|city|town|மவட்டம்|மாவட்டம்|జిల్లా|जिला)\b/gi, '')
    .trim();

  // 1. Check direct alias mapping
  if (DISTRICT_ALIASES[clean]) {
    const res = DISTRICT_ALIASES[clean];
    if (!stateContext || normalizeStateName(stateContext).toLowerCase() === res.state.toLowerCase()) {
      return res;
    }
  }

  // 2. If stateContext is available, search inside that state's districts first
  const normState = stateContext ? normalizeStateName(stateContext) : '';
  if (normState && INDIA_STATES_DISTRICTS[normState]) {
    const districts = INDIA_STATES_DISTRICTS[normState].districts;
    for (const d of districts) {
      if (d.toLowerCase() === clean || d.toLowerCase().includes(clean) || clean.includes(d.toLowerCase())) {
        return { district: d, state: normState };
      }
    }
  }

  // 3. Search across all states
  for (const stateName of Object.keys(INDIA_STATES_DISTRICTS)) {
    const districts = INDIA_STATES_DISTRICTS[stateName].districts;
    for (const d of districts) {
      if (d.toLowerCase() === clean || d.toLowerCase().includes(clean) || clean.includes(d.toLowerCase())) {
        return { district: d, state: stateName };
      }
    }
  }

  // 4. Check coordinates map
  for (const [dName, coords] of Object.entries(DISTRICT_COORDINATES)) {
    if (dName.toLowerCase() === clean || clean.includes(dName.toLowerCase()) || dName.toLowerCase().includes(clean)) {
      return { district: dName, state: coords.state };
    }
  }

  return null;
}

/**
 * Normalizes district name to canonical string name
 */
export function normalizeDistrictName(districtInput?: string, stateContext?: string): string {
  if (!districtInput) return '';
  const info = getDistrictInfo(districtInput, stateContext);
  if (info) return info.district;
  const clean = districtInput
    .trim()
    .replace(/\b(district|dist|city|town|மவட்டம்|மாவட்டம்|జిల్లా|जिला)\b/gi, '')
    .trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

/**
 * Checks if state is a valid Indian state/UT
 */
export function isValidState(stateName?: string): boolean {
  if (!stateName) return false;
  const canonical = normalizeStateName(stateName);
  return Boolean(canonical && INDIA_STATES_DISTRICTS[canonical]);
}

/**
 * Validates if the given district strictly belongs to the given state
 */
export function isValidDistrictForState(stateName?: string, districtName?: string): boolean {
  if (!stateName || !districtName) return false;
  const canonicalState = normalizeStateName(stateName);
  if (!canonicalState || !INDIA_STATES_DISTRICTS[canonicalState]) {
    return false;
  }

  const cleanDistrict = districtName
    .toLowerCase()
    .trim()
    .replace(/\b(district|dist|city|town|மவட்டம்|மாவட்டம்|జిల్లా|जिला)\b/gi, '')
    .trim();

  const validDistricts = INDIA_STATES_DISTRICTS[canonicalState].districts.map((d) => d.toLowerCase());

  // Direct or substring match in state's district list
  const isMatch = validDistricts.some((d) => d === cleanDistrict || d.includes(cleanDistrict) || cleanDistrict.includes(d));
  if (isMatch) return true;

  // Check alias table
  const alias = DISTRICT_ALIASES[cleanDistrict];
  if (alias && alias.state.toLowerCase() === canonicalState.toLowerCase()) {
    return true;
  }

  return false;
}

/**
 * Validates State and District pair, returning normalized values and error message if mismatched
 */
export function validateStateAndDistrict(stateInput?: string, districtInput?: string): {
  isValid: boolean;
  state: string;
  district: string;
  error?: string;
  suggestedDistricts?: string[];
} {
  const state = normalizeStateName(stateInput);
  if (!state || !INDIA_STATES_DISTRICTS[state]) {
    return {
      isValid: false,
      state: stateInput || '',
      district: districtInput || '',
      error: `State "${stateInput || ''}" is not recognized in India.`
    };
  }

  if (!districtInput) {
    return {
      isValid: false,
      state,
      district: '',
      error: `District is required for state ${state}.`
    };
  }

  const isValidDist = isValidDistrictForState(state, districtInput);
  const district = normalizeDistrictName(districtInput, state);

  if (!isValidDist) {
    const validDists = getDistrictsForState(state);
    return {
      isValid: false,
      state,
      district: districtInput,
      error: `District "${districtInput}" does not belong to ${state}. Please select a valid district in ${state}.`,
      suggestedDistricts: validDists.slice(0, 6)
    };
  }

  return {
    isValid: true,
    state,
    district
  };
}

/**
 * Returns district centroid coordinates with label indication
 * Supports getDistrictCentroid(state, district) or getDistrictCentroid(district)
 */
export function getDistrictCentroid(
  arg1?: string,
  arg2?: string
): { latitude: number; longitude: number; lat: number; lng: number; isCentroid: boolean } {
  let state = '';
  let district = '';

  if (arg1 && arg2) {
    if (isValidState(arg1)) {
      state = normalizeStateName(arg1);
      district = normalizeDistrictName(arg2, state);
    } else {
      district = normalizeDistrictName(arg1, arg2);
      state = normalizeStateName(arg2);
    }
  } else if (arg1) {
    district = normalizeDistrictName(arg1);
    const info = getDistrictInfo(arg1);
    if (info) state = info.state;
  }

  // 1. Direct district match in DISTRICT_COORDINATES
  if (district && DISTRICT_COORDINATES[district]) {
    const coords = DISTRICT_COORDINATES[district];
    return {
      latitude: coords.latitude,
      longitude: coords.longitude,
      lat: coords.latitude,
      lng: coords.longitude,
      isCentroid: true
    };
  }

  // 2. Case-insensitive lookup in DISTRICT_COORDINATES
  if (district) {
    const distLower = district.toLowerCase().trim();
    for (const [dName, coords] of Object.entries(DISTRICT_COORDINATES)) {
      if (dName.toLowerCase() === distLower) {
        return {
          latitude: coords.latitude,
          longitude: coords.longitude,
          lat: coords.latitude,
          lng: coords.longitude,
          isCentroid: true
        };
      }
    }
  }

  // 3. Fallback to alias / info
  const dInfo = getDistrictInfo(district, state);
  if (dInfo && DISTRICT_COORDINATES[dInfo.district]) {
    const coords = DISTRICT_COORDINATES[dInfo.district];
    return {
      latitude: coords.latitude,
      longitude: coords.longitude,
      lat: coords.latitude,
      lng: coords.longitude,
      isCentroid: true
    };
  }

  // 4. Default fallback: Theni, Tamil Nadu
  return {
    latitude: 10.0104,
    longitude: 77.4768,
    lat: 10.0104,
    lng: 77.4768,
    isCentroid: true
  };
}

