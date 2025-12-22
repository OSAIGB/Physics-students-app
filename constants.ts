
import { Question } from './types';

export const QUESTION_TIME_LIMIT = 30; // 30 seconds
export const TOTAL_QUIZ_TIME_LIMIT = 15 * 60; // 15 minutes
export const IP_LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes in ms

export const QUESTIONS: Question[] = [
  {q:"A copper wire expands when heated. New length?", a:["20.020","20.100","20.200","20.400","21.000"], c:2},
  {q:"Triple coexistence point of water?", a:["Absolute zero","Median gas point","Triple point","Critical temp","Dew point"], c:2},
  {q:"Thermal equilibrium implies?", a:["Same heat","Same SHC","Same temperature","Same k","Same mass"], c:2},
  {q:"Final temperature of mixed water?", a:["40","50","60","70","75"], c:2},
  {q:"Specific heat from heater?", a:["160","320","400","800","1200"], c:1},
  {q:"Radiation ∝ T⁴ law?", a:["Newton","Stefan","Charles","First law","Hooke"], c:1},
  {q:"New gas pressure?", a:["0.5e5","1e5","2e5","4e5","8e5"], c:2},
  {q:"Adiabatic compression temp?", a:["200","400","566","600","800"], c:2},
  {q:"Gas pressure due to?", a:["Forces","PE","Bombardment","Volume","Gravity"], c:2},
  {q:"Carnot work output?", a:["500","1000","1500","2000","3000"], c:1},
  {q:"Isothermal heat equation?", a:["nRTΔV","nRTln(V2/V1)","ln(P1-P2)","KT","mcΔT"], c:1},
  {q:"ΔU in a cycle?", a:["Max","Path","Zero","Increase","Not state"], c:2},
  {q:"Wave frequency?", a:["1","2","4","6.28","12.56"], c:1},
  {q:"Wavelength?", a:["0.4","0.8","1.25","2","5"], c:1},
  {q:"Frequency shift effect?", a:["Huygens","Doppler","Interference","Diffraction","Polarization"], c:1},
  {q:"Planck constant dimension?", a:["ML2T-2","ML2T-1","ML3T-1","L2T-1","MLT-2"], c:1},
  {q:"Mass from density?", a:["4.45e3","10.9e3","15e3","17.8e3","20.4e3"], c:3},
  {q:"Purpose of dimensional analysis?", a:["Constants","Consistency","Weight","Sig figs","Error"], c:1},
  {q:"Work done by vectors?", a:["14","22","48","58","70"], c:3},
  {q:"Zero cross product means?", a:["Perpendicular","Parallel","45°","Unit","None"], c:1},
  {q:"Resultant magnitude?", a:["√14","√26","√35","√42","6"], c:2},
  {q:"Displacement from v(t)?", a:["11","15","22","28","35"], c:2},
  {q:"Max height?", a:["15.5","25","31.25","50","62.5"], c:2},
  {q:"Probe velocity?", a:["3300","1700","2000","1250","800"], c:1},
  {q:"Lift normal force?", a:["150","600","750","900","1050"], c:3},
  {q:"Elastic collision v₂?", a:["4","6","8","10","12"], c:2},
  {q:"Force between blocks?", a:["160","100","60","30","20"], c:2},
  {q:"Kepler law of areas?", a:["Ellipse","Equal areas","T²∝R³","Inverse","Geo"], c:1},
  {q:"g with altitude?", a:["Increase","Constant","Decrease","Mass","G"], c:2},
  {q:"Geostationary satellite?", a:["Escape","1000km","24hr period","No gravity","Random"], c:2}
];
