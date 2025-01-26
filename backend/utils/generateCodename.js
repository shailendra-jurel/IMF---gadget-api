const codenames = [
    'The Nightingale', 'The Kraken', 'Silver Shadow', 'Phoenix Rising', 
    'Ghost Protocol', 'Blue Phantom', 'Crimson Dagger', 'Silent Storm'
  ];
  
  function generateCodename() {
    return codenames[Math.floor(Math.random() * codenames.length)];
  }
  
  function generateMissionProbability() {
    return Number((Math.random() * 100).toFixed(2));
  }
  
  module.exports = {
    generateCodename,
    generateMissionProbability
  };