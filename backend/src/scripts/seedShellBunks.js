/**
 * Seed Shell Petrol Bunks Across Chennai
 * Run this script to add Shell petrol bunks to the database
 * Coverage: All major areas of Chennai within 3km radius
 * 
 * Usage: node backend/src/scripts/seedShellBunks.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const PetrolBunk = require('../models/PetrolBunk');
const User = require('../models/User');

// Shell Petrol Bunks Data - Strategically placed across Chennai
const shellBunks = [
  // Central Chennai
  {
    name: 'Shell Petrol Bunk - T Nagar',
    registrationNumber: 'SHELL-TN-001',
    contactPerson: {
      name: 'Rajesh Kumar',
      phone: '9876543210',
      email: 'tnagar@shell.com'
    },
    address: {
      street: 'Usman Road',
      landmark: 'Near Panagal Park',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600017',
      country: 'India'
    },
    location: {
      type: 'Point',
      coordinates: [80.2337, 13.0418] // [longitude, latitude]
    },
    fuelAvailability: {
      diesel: { available: true, price: 94.50, stock: 5000 },
      petrol: { available: true, price: 104.75, stock: 5000 }
    }
  },

  // North Chennai
  {
    name: 'Shell Petrol Bunk - Anna Nagar',
    registrationNumber: 'SHELL-AN-002',
    contactPerson: {
      name: 'Suresh Babu',
      phone: '9876543211',
      email: 'annanagar@shell.com'
    },
    address: {
      street: 'Second Avenue',
      landmark: 'Near Anna Nagar Tower',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600040',
      country: 'India'
    },
    location: {
      type: 'Point',
      coordinates: [80.2088, 13.0850]
    },
    fuelAvailability: {
      diesel: { available: true, price: 94.50, stock: 5000 },
      petrol: { available: true, price: 104.75, stock: 5000 }
    }
  },

  {
    name: 'Shell Petrol Bunk - Kilpauk',
    registrationNumber: 'SHELL-KP-003',
    contactPerson: {
      name: 'Venkatesh M',
      phone: '9876543212',
      email: 'kilpauk@shell.com'
    },
    address: {
      street: 'Poonamallee High Road',
      landmark: 'Near Kilpauk Medical College',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600010',
      country: 'India'
    },
    location: {
      type: 'Point',
      coordinates: [80.2440, 13.0732]
    },
    fuelAvailability: {
      diesel: { available: true, price: 94.50, stock: 5000 },
      petrol: { available: true, price: 104.75, stock: 5000 }
    }
  },

  // South Chennai
  {
    name: 'Shell Petrol Bunk - Adyar',
    registrationNumber: 'SHELL-AD-004',
    contactPerson: {
      name: 'Prakash Reddy',
      phone: '9876543213',
      email: 'adyar@shell.com'
    },
    address: {
      street: 'Sardar Patel Road',
      landmark: 'Near Adyar Signal',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600020',
      country: 'India'
    },
    location: {
      type: 'Point',
      coordinates: [80.2574, 13.0067]
    },
    fuelAvailability: {
      diesel: { available: true, price: 94.50, stock: 5000 },
      petrol: { available: true, price: 104.75, stock: 5000 }
    }
  },

  {
    name: 'Shell Petrol Bunk - Velachery',
    registrationNumber: 'SHELL-VC-005',
    contactPerson: {
      name: 'Karthik Shankar',
      phone: '9876543214',
      email: 'velachery@shell.com'
    },
    address: {
      street: 'Velachery Main Road',
      landmark: 'Near Phoenix Mall',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600042',
      country: 'India'
    },
    location: {
      type: 'Point',
      coordinates: [80.2207, 12.9750]
    },
    fuelAvailability: {
      diesel: { available: true, price: 94.50, stock: 5000 },
      petrol: { available: true, price: 104.75, stock: 5000 }
    }
  },

  {
    name: 'Shell Petrol Bunk - Guindy',
    registrationNumber: 'SHELL-GD-006',
    contactPerson: {
      name: 'Arun Kumar',
      phone: '9876543215',
      email: 'guindy@shell.com'
    },
    address: {
      street: 'Mount Poonamallee Road',
      landmark: 'Near Guindy Industrial Estate',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600032',
      country: 'India'
    },
    location: {
      type: 'Point',
      coordinates: [80.2207, 13.0067]
    },
    fuelAvailability: {
      diesel: { available: true, price: 94.50, stock: 5000 },
      petrol: { available: true, price: 104.75, stock: 5000 }
    }
  },

  // East Chennai
  {
    name: 'Shell Petrol Bunk - Mylapore',
    registrationNumber: 'SHELL-MY-007',
    contactPerson: {
      name: 'Ravi Chandran',
      phone: '9876543216',
      email: 'mylapore@shell.com'
    },
    address: {
      street: 'Luz Church Road',
      landmark: 'Near Kapaleeshwarar Temple',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600004',
      country: 'India'
    },
    location: {
      type: 'Point',
      coordinates: [80.2667, 13.0339]
    },
    fuelAvailability: {
      diesel: { available: true, price: 94.50, stock: 5000 },
      petrol: { available: true, price: 104.75, stock: 5000 }
    }
  },

  {
    name: 'Shell Petrol Bunk - Nungambakkam',
    registrationNumber: 'SHELL-NB-008',
    contactPerson: {
      name: 'Deepak Sharma',
      phone: '9876543217',
      email: 'nungambakkam@shell.com'
    },
    address: {
      street: 'Nungambakkam High Road',
      landmark: 'Near Sterling Road Junction',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600034',
      country: 'India'
    },
    location: {
      type: 'Point',
      coordinates: [80.2425, 13.0569]
    },
    fuelAvailability: {
      diesel: { available: true, price: 94.50, stock: 5000 },
      petrol: { available: true, price: 104.75, stock: 5000 }
    }
  },

  // West Chennai
  {
    name: 'Shell Petrol Bunk - Porur',
    registrationNumber: 'SHELL-PR-009',
    contactPerson: {
      name: 'Sanjay Patel',
      phone: '9876543218',
      email: 'porur@shell.com'
    },
    address: {
      street: 'Mount Poonamallee Road',
      landmark: 'Near Porur Bus Depot',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600116',
      country: 'India'
    },
    location: {
      type: 'Point',
      coordinates: [80.1581, 13.0358]
    },
    fuelAvailability: {
      diesel: { available: true, price: 94.50, stock: 5000 },
      petrol: { available: true, price: 104.75, stock: 5000 }
    }
  },

  {
    name: 'Shell Petrol Bunk - Vadapalani',
    registrationNumber: 'SHELL-VP-010',
    contactPerson: {
      name: 'Mukesh Jain',
      phone: '9876543219',
      email: 'vadapalani@shell.com'
    },
    address: {
      street: 'Arcot Road',
      landmark: 'Near Vadapalani Metro Station',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600026',
      country: 'India'
    },
    location: {
      type: 'Point',
      coordinates: [80.2120, 13.0502]
    },
    fuelAvailability: {
      diesel: { available: true, price: 94.50, stock: 5000 },
      petrol: { available: true, price: 104.75, stock: 5000 }
    }
  },

  // OMR Corridor
  {
    name: 'Shell Petrol Bunk - Thoraipakkam',
    registrationNumber: 'SHELL-TP-011',
    contactPerson: {
      name: 'Ramesh Kumar',
      phone: '9876543220',
      email: 'thoraipakkam@shell.com'
    },
    address: {
      street: 'Old Mahabalipuram Road',
      landmark: 'Near Thoraipakkam Signal',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600097',
      country: 'India'
    },
    location: {
      type: 'Point',
      coordinates: [80.2341, 12.9391]
    },
    fuelAvailability: {
      diesel: { available: true, price: 94.50, stock: 5000 },
      petrol: { available: true, price: 104.75, stock: 5000 }
    }
  },

  {
    name: 'Shell Petrol Bunk - Sholinganallur',
    registrationNumber: 'SHELL-SL-012',
    contactPerson: {
      name: 'Anand Krishnan',
      phone: '9876543221',
      email: 'sholinganallur@shell.com'
    },
    address: {
      street: 'Rajiv Gandhi Salai (OMR)',
      landmark: 'Near Sholinganallur Junction',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600119',
      country: 'India'
    },
    location: {
      type: 'Point',
      coordinates: [80.2272, 12.9010]
    },
    fuelAvailability: {
      diesel: { available: true, price: 94.50, stock: 5000 },
      petrol: { available: true, price: 104.75, stock: 5000 }
    }
  },

  // Airport Area
  {
    name: 'Shell Petrol Bunk - Meenambakkam',
    registrationNumber: 'SHELL-MB-013',
    contactPerson: {
      name: 'Vijay Raghavan',
      phone: '9876543222',
      email: 'meenambakkam@shell.com'
    },
    address: {
      street: 'GST Road',
      landmark: 'Near Chennai Airport',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600027',
      country: 'India'
    },
    location: {
      type: 'Point',
      coordinates: [80.1638, 12.9902]
    },
    fuelAvailability: {
      diesel: { available: true, price: 94.50, stock: 5000 },
      petrol: { available: true, price: 104.75, stock: 5000 }
    }
  },

  // ECR Corridor
  {
    name: 'Shell Petrol Bunk - Thiruvanmiyur',
    registrationNumber: 'SHELL-TV-014',
    contactPerson: {
      name: 'Manoj Varma',
      phone: '9876543223',
      email: 'thiruvanmiyur@shell.com'
    },
    address: {
      street: 'East Coast Road',
      landmark: 'Near Thiruvanmiyur Beach',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600041',
      country: 'India'
    },
    location: {
      type: 'Point',
      coordinates: [80.2595, 12.9833]
    },
    fuelAvailability: {
      diesel: { available: true, price: 94.50, stock: 5000 },
      petrol: { available: true, price: 104.75, stock: 5000 }
    }
  },

  {
    name: 'Shell Petrol Bunk - Palavakkam',
    registrationNumber: 'SHELL-PV-015',
    contactPerson: {
      name: 'Naveen Kumar',
      phone: '9876543224',
      email: 'palavakkam@shell.com'
    },
    address: {
      street: 'East Coast Road',
      landmark: 'Near VGP Golden Beach',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600041',
      country: 'India'
    },
    location: {
      type: 'Point',
      coordinates: [80.2536, 12.9617]
    },
    fuelAvailability: {
      diesel: { available: true, price: 94.50, stock: 5000 },
      petrol: { available: true, price: 104.75, stock: 5000 }
    }
  },

  // Additional Strategic Locations
  {
    name: 'Shell Petrol Bunk - Egmore',
    registrationNumber: 'SHELL-EG-016',
    contactPerson: {
      name: 'Bala Murugan',
      phone: '9876543225',
      email: 'egmore@shell.com'
    },
    address: {
      street: 'Poonamallee High Road',
      landmark: 'Near Egmore Railway Station',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600008',
      country: 'India'
    },
    location: {
      type: 'Point',
      coordinates: [80.2609, 13.0732]
    },
    fuelAvailability: {
      diesel: { available: true, price: 94.50, stock: 5000 },
      petrol: { available: true, price: 104.75, stock: 5000 }
    }
  },

  {
    name: 'Shell Petrol Bunk - Ambattur',
    registrationNumber: 'SHELL-AM-017',
    contactPerson: {
      name: 'Senthil Kumar',
      phone: '9876543226',
      email: 'ambattur@shell.com'
    },
    address: {
      street: 'CTH Road',
      landmark: 'Near Ambattur Industrial Estate',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600058',
      country: 'India'
    },
    location: {
      type: 'Point',
      coordinates: [80.1610, 13.1143]
    },
    fuelAvailability: {
      diesel: { available: true, price: 94.50, stock: 5000 },
      petrol: { available: true, price: 104.75, stock: 5000 }
    }
  },

  {
    name: 'Shell Petrol Bunk - Chromepet',
    registrationNumber: 'SHELL-CP-018',
    contactPerson: {
      name: 'Rajendran S',
      phone: '9876543227',
      email: 'chromepet@shell.com'
    },
    address: {
      street: 'GST Road',
      landmark: 'Near Chromepet Railway Station',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600044',
      country: 'India'
    },
    location: {
      type: 'Point',
      coordinates: [80.1423, 12.9516]
    },
    fuelAvailability: {
      diesel: { available: true, price: 94.50, stock: 5000 },
      petrol: { available: true, price: 104.75, stock: 5000 }
    }
  },

  {
    name: 'Shell Petrol Bunk - Perungudi',
    registrationNumber: 'SHELL-PG-019',
    contactPerson: {
      name: 'Srinivasan M',
      phone: '9876543228',
      email: 'perungudi@shell.com'
    },
    address: {
      street: 'Old Mahabalipuram Road',
      landmark: 'Near Perungudi MRTS Station',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600096',
      country: 'India'
    },
    location: {
      type: 'Point',
      coordinates: [80.2396, 12.9611]
    },
    fuelAvailability: {
      diesel: { available: true, price: 94.50, stock: 5000 },
      petrol: { available: true, price: 104.75, stock: 5000 }
    }
  },

  {
    name: 'Shell Petrol Bunk - Tambaram',
    registrationNumber: 'SHELL-TB-020',
    contactPerson: {
      name: 'Mohan Raj',
      phone: '9876543229',
      email: 'tambaram@shell.com'
    },
    address: {
      street: 'GST Road',
      landmark: 'Near Tambaram Sanatorium',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600045',
      country: 'India'
    },
    location: {
      type: 'Point',
      coordinates: [80.1269, 12.9249]
    },
    fuelAvailability: {
      diesel: { available: true, price: 94.50, stock: 5000 },
      petrol: { available: true, price: 104.75, stock: 5000 }
    }
  }
];

/**
 * Seed the database
 */
const seedDatabase = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected\n');

    // Create a default Shell owner user if not exists
    let shellOwner = await User.findOne({ phone: '9999999999' });
    
    if (!shellOwner) {
      console.log('📝 Creating Shell Petrol Bunks owner user...');
      shellOwner = await User.create({
        phone: '9999999999',
        name: 'Shell India',
        role: 'petrol_bunk',
        isVerified: true
      });
      console.log('✅ Shell owner user created\n');
    }

    // Clear existing Shell bunks (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing Shell bunks...');
    await PetrolBunk.deleteMany({ registrationNumber: /^SHELL-/ });
    console.log('✅ Existing Shell bunks cleared\n');

    // Insert Shell bunks
    console.log('📦 Adding Shell Petrol Bunks across Chennai...\n');
    
    for (const bunkData of shellBunks) {
      const bunk = await PetrolBunk.create({
        ...bunkData,
        userId: shellOwner._id,
        status: 'active',
        isVerified: true,
        isPesoApproved: true,
        isOpen24x7: true,
        serviceRadius: 3000, // 3 km radius
        rating: {
          average: 4.5,
          count: 50
        }
      });
      
      console.log(`✅ Added: ${bunk.name} - ${bunk.address.street}, ${bunk.address.city}`);
    }

    console.log(`\n🎉 Successfully added ${shellBunks.length} Shell Petrol Bunks!`);
    console.log('\n📊 Coverage Summary:');
    console.log('   - Central Chennai: 2 bunks');
    console.log('   - North Chennai: 3 bunks');
    console.log('   - South Chennai: 3 bunks');
    console.log('   - East Chennai: 2 bunks');
    console.log('   - West Chennai: 2 bunks');
    console.log('   - OMR Corridor: 2 bunks');
    console.log('   - ECR Corridor: 2 bunks');
    console.log('   - Airport Area: 1 bunk');
    console.log('   - Other Areas: 3 bunks');
    console.log('\n✨ All bunks are active and within 3km service radius!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed
seedDatabase();