
import { Question } from './types';

export const QUESTION_TIME_LIMIT = 30; // 30 seconds
export const TOTAL_QUIZ_TIME_LIMIT = 15 * 60; // 15 minutes
export const IP_LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes in ms

export const QUESTIONS: Question[] = [
  // Temperature and Thermometry
  {
    q: "A copper wire with an initial length of 20 m is at a temperature of 20°C. If the wire is heated to 70°C and the linear expansivity of the wire is 2.0 x 10⁻⁴ K⁻¹, what is the new length of the wire?",
    a: ["20.020 m", "20.100 m", "20.200 m", "20.400 m", "21.000 m"],
    c: 2
  },
  {
    q: "In thermal physics, the specific state where saturated water vapour, pure water, and melting ice coexist in equilibrium is known as the:",
    a: ["Absolute zero", "Median gas point", "Triple point of water", "Critical temperature", "Dew point"],
    c: 2
  },
  {
    q: "If two distinct bodies are in thermal contact and reach a state of thermal equilibrium, which of the following must be true?",
    a: ["They possess the same amount of heat.", "They have identical specific heat capacities.", "They are at the same temperature.", "Their thermal conductivities are equal.", "Their masses must be identical."],
    c: 2
  },
  // Heat and Energy
  {
    q: "A mass of 100g of water at 20°C is mixed with 200g of water at 80°C. Assuming no heat is lost to the surroundings, what is the final temperature of the mixture?",
    a: ["40°C", "50°C", "60°C", "70°C", "75°C"],
    c: 2
  },
  {
    q: "An electric heater with a resistance of 10 Ω carries a current of 2A for 20 seconds. It is submerged in 500g of a liquid, causing a temperature rise of 5°C. Calculate the specific heat capacity of the liquid.",
    a: ["160 J/kg·°C", "320 J/kg·°C", "400 J/kg·°C", "800 J/kg·°C", "1200 J/kg·°C"],
    c: 1
  },
  {
    q: "Which law describes the total power radiated per unit surface area of a blackbody as being proportional to the fourth power of its thermodynamic temperature?",
    a: ["Newton’s Law of Cooling", "Stefan-Boltzmann’s Law", "Charles’ Law", "First Law of Thermodynamics", "Hooke's Law"],
    c: 1
  },
  // Ideal Gases
  {
    q: "A fixed mass of gas occupies 5.0 m³ at 273 K and a pressure of 2 x 10⁵ N/m². If the volume is increased to 10.0 m³ and the temperature is raised to 546 K, what is the new pressure?",
    a: ["0.5 x 10⁵ N/m²", "1 x 10⁵ N/m²", "2 x 10⁵ N/m²", "4 x 10⁵ N/m²", "8 x 10⁵ N/m²"],
    c: 2
  },
  {
    q: "A gas initially at 400 K is compressed adiabatically to half of its original volume. If the adiabatic index (γ) is 1.5, what is the approximate final temperature of the gas?",
    a: ["200 K", "400 K", "566 K", "600 K", "800 K"],
    c: 2
  },
  {
    q: "According to the kinetic theory of gases, the pressure exerted by an ideal gas on the walls of its container is due to:",
    a: ["The intermolecular forces between gas molecules.", "The potential energy of the molecules.", "The bombardment of the walls by the molecules.", "The volume occupied by the molecules themselves.", "The gravitational pull on the gas."],
    c: 2
  },
  // Thermodynamics
  {
    q: "A Carnot engine operates between a high-temperature reservoir at 600 K and a low-temperature reservoir at 300 K. If it absorbs 2000 J of heat from the high-temperature reservoir, what is the work output?",
    a: ["500 J", "1000 J", "1500 J", "2000 J", "3000 J"],
    c: 1
  },
  {
    q: "For n moles of an ideal gas undergoing an isothermal expansion from volume V₁ to V₂, the expression for the heat taken in is:",
    a: ["nRT(V₂ - V₁)", "nRT ln(V₂/V₁)", "nRT ln(P₁ - P₂)", "KT ln(P₁/P₂)", "mcΔT"],
    c: 1
  },
  {
    q: "Regarding a system undergoing a complete cyclic process, which statement about the internal energy is correct?",
    a: ["The internal energy is always at its maximum.", "The internal energy depends only on the path taken.", "The change in internal energy over one complete cycle is zero.", "The internal energy increases in every cycle.", "Internal energy is not a state function."],
    c: 2
  },
  // Waves
  {
    q: "The equation of a progressive wave is given by y = (5.00 cm) sin(12.56t - 2.11x), where t is in seconds. What is the frequency of the wave?",
    a: ["1.0 Hz", "2.0 Hz", "4.0 Hz", "6.28 Hz", "12.56 Hz"],
    c: 1
  },
  {
    q: "A wave source generates 100 full vibrations in 2 seconds. If the wave travels at a speed of 40 m/s, what is the wavelength of the wave?",
    a: ["0.40 m", "0.80 m", "1.25 m", "2.00 m", "5.00 m"],
    c: 1
  },
  {
    q: "The phenomenon where the observed frequency of a wave changes because the source and the observer are moving relative to each other is known as:",
    a: ["The Huygens' Principle", "The Doppler Effect", "Interference", "Diffraction", "Polarization"],
    c: 1
  },
  // Physical Quantities and Units
  {
    q: "Based on dimensional analysis (M, L, T), what is the correct dimensional expression for Planck’s constant?",
    a: ["M¹L²T⁻²", "M¹L²T⁻¹", "M¹L³T⁻¹", "M⁰L²T⁻¹", "M¹L¹T⁻²"],
    c: 1
  },
  {
    q: "A copper rod has a density of 8.9 x 10³ kg/m³. If the rod is placed in a tank and occupies a volume of 2.0 m³, what is the total mass of the copper rod?",
    a: ["4.45 x 10³ kg", "10.9 x 10³ kg", "15.0 x 10³ kg", "17.8 x 10³ kg", "20.4 x 10³ kg"],
    c: 3
  },
  {
    q: "Which of the following is a primary reason for using dimensional analysis in physics?",
    a: ["To determine the exact numerical constant in an equation.", "To check the consistency of equations involving physical quantities.", "To measure the weight of an object instead of its mass.", "To eliminate the need for significant figures.", "To calculate the error in a graphical analysis."],
    c: 1
  },
  // Vectors
  {
    q: "A force F = (8.0i + 6.0j)N acts on a particle, causing a displacement of Δx = (5.0i + 3.0j)m. Calculate the work done by this force.",
    a: ["14 J", "22 J", "48 J", "58 J", "70 J"],
    c: 3
  },
  {
    q: "The magnitude of the cross product of two vectors, A and B, is found to be zero. This indicates that the two vectors are:",
    a: ["Perpendicular to each other", "Parallel or anti-parallel to each other", "At an angle of 45° to each other", "Unit vectors", "Mutually exclusive"],
    c: 1
  },
  {
    q: "Two vectors, P = 2i + 3j - k and Q = -i + 2j + 4k, exist in a 3D coordinate system. What is the magnitude of the resultant vector R = P + Q?",
    a: ["√14", "√26", "√35", "√42", "6"],
    c: 2
  },
  // Kinematics
  {
    q: "A particle travels along a straight path with a velocity defined by v(t) = 4t + 3 (where v is in m/s). What is the total displacement of the particle between t = 1 s and t = 3 s?",
    a: ["11 meters", "15 meters", "22 meters", "28 meters", "35 meters"],
    c: 2
  },
  {
    q: "A student throws a ball vertically upward with an initial velocity of 25 m/s. Neglecting air resistance and using g = 10 m/s², what is the maximum height the ball reaches?",
    a: ["15.5 m", "25.0 m", "31.25 m", "50.0 m", "62.5 m"],
    c: 2
  },
  {
    q: "A reconnaissance plane flying at 2500 km/h relative to the ground releases a probe backward at a speed of 800 km/h relative to the plane. What is the velocity of the probe as observed from the ground?",
    a: ["3300 km/h", "1700 km/h", "2000 km/h", "1250 km/h", "800 km/h"],
    c: 1
  },
  // Dynamics
  {
    q: "A worker with a mass of 75 kg stands inside a lift. If the lift accelerates upwards at 2 m/s², what is the normal force exerted by the lift floor on the worker? (Take g = 10 m/s²)",
    a: ["150 N", "600 N", "750 N", "900 N", "1050 N"],
    c: 3
  },
  {
    q: "Two masses, m₁ = 4 kg and m₂ = 6 kg, undergo a perfectly elastic collision. If m₁ is moving at 10 m/s and m₂ is at rest, what is the final velocity of m₂?",
    a: ["4 m/s", "6 m/s", "8 m/s", "10 m/s", "12 m/s"],
    c: 2
  },
  {
    q: "Two blocks of mass 50 kg and 30 kg are in contact on a horizontal frictionless surface. A force of 160 N is applied to the 50 kg block. What is the magnitude of the force exerted by the 50 kg block on the 30 kg block?",
    a: ["160 N", "100 N", "60 N", "30 N", "20 N"],
    c: 2
  },
  // The Gravitational Field
  {
    q: "According to Kepler’s Laws, which of the following statements best describes the 'Law of Areas'?",
    a: ["All planets move in elliptical orbits with the sun at one focus.", "A line connecting a planet to the sun sweeps out equal areas in equal time intervals.", "The square of the period is proportional to the cube of the distance.", "The gravitational force follows an inverse square law.", "Satellites in parking orbits must be geostationary."],
    c: 1
  },
  {
    q: "If a satellite is orbiting at a height where the gravitational field strength is significantly lower than at the surface, how does the field strength g vary with altitude?",
    a: ["It increases as the square of the altitude.", "It remains constant regardless of height.", "It decreases as altitude increases.", "It depends only on the mass of the satellite.", "It is equal to the Universal Gravitational Constant G."],
    c: 2
  },
  {
    q: "A satellite is placed in a geostationary orbit. This means the satellite:",
    a: ["Has reached escape velocity.", "Orbiting at a height of exactly 1000 km.", "Has an orbital period equal to the Earth’s rotation period.", "Is unaffected by the Earth's gravitational field.", "Moves in a random translational motion."],
    c: 2
  }
];
