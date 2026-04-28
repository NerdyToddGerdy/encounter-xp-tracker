const { useState, useEffect } = React;
const { Plus, Trash2, X, Copy, Check } = lucide;

const MONSTER_XP = {
  'CR 0': 10,
  'CR 1/8': 25,
  'CR 1/4': 50,
  'CR 1/2': 100,
  'CR 1': 200,
  'CR 2': 450,
  'CR 3': 700,
  'CR 4': 1100,
  'CR 5': 1800,
  'CR 6': 2300,
  'CR 7': 2900,
  'CR 8': 3900,
  'CR 9': 5000,
  'CR 10': 5900,
  'CR 11': 7200,
  'CR 12': 8400,
  'CR 13': 10000,
  'CR 14': 11500,
  'CR 15': 13000,
  'CR 16': 15000,
  'CR 17': 18000,
  'CR 18': 20000,
  'CR 19': 22000,
  'CR 20': 25000,
  'CR 21': 33000,
  'CR 22': 41000,
  'CR 23': 50000,
  'CR 24': 62000,
  'CR 25': 75000,
  'CR 26': 90000,
  'CR 27': 105000,
  'CR 28': 120000,
  'CR 29': 135000,
  'CR 30': 155000
};

function XPTracker() {
  const [encounters, setEncounters] = useState([]);
  const [newEncounterName, setNewEncounterName] = useState('');
  const [numPCs, setNumPCs] = useState(4);
  const [copied, setCopied] = useState(false);

  useEffect(() => { lucide.createIcons(); });

  const getEncounterMultiplier = (monsterCount) => {
    if (monsterCount === 0) return 1;
    if (monsterCount === 1) return 1;
    if (monsterCount === 2) return 1.5;
    if (monsterCount >= 3 && monsterCount <= 6) return 2;
    if (monsterCount >= 7 && monsterCount <= 10) return 2.5;
    if (monsterCount >= 11 && monsterCount <= 14) return 3;
    return 4;
  };

  const calculateEncounterXP = (encounter) => {
    const baseXP = encounter.monsters.reduce((total, monster) => {
      return total + (MONSTER_XP[monster.cr] * monster.count);
    }, 0);
    
    const totalMonsters = encounter.monsters.reduce((sum, m) => sum + m.count, 0);
    const multiplier = getEncounterMultiplier(totalMonsters);
    
    return Math.floor(baseXP * multiplier);
  };

  const updateEncounterName = (encounterId, newName) => {
    setEncounters(encounters.map(e => {
      if (e.id === encounterId) {
        return { ...e, name: newName };
      }
      return e;
    }));
  };

  const addEncounter = () => {
    const name = newEncounterName.trim() || `Encounter ${encounters.length + 1}`;
    setEncounters([...encounters, { id: Date.now(), name, monsters: [] }]);
    setNewEncounterName('');
  };

  const deleteEncounter = (id) => {
    setEncounters(encounters.filter(e => e.id !== id));
  };

  const addMonster = (encounterId) => {
    setEncounters(encounters.map(e => {
      if (e.id === encounterId) {
        return {
          ...e,
          monsters: [...e.monsters, { id: Date.now(), cr: 'CR 1', count: 1, name: '' }]
        };
      }
      return e;
    }));
  };

  const updateMonster = (encounterId, monsterId, field, value) => {
    setEncounters(encounters.map(e => {
      if (e.id === encounterId) {
        return {
          ...e,
          monsters: e.monsters.map(m => {
            if (m.id === monsterId) {
              return { ...m, [field]: value };
            }
            return m;
          })
        };
      }
      return e;
    }));
  };

  const deleteMonster = (encounterId, monsterId) => {
    setEncounters(encounters.map(e => {
      if (e.id === encounterId) {
        return {
          ...e,
          monsters: e.monsters.filter(m => m.id !== monsterId)
        };
      }
      return e;
    }));
  };

  const totalXP = encounters.reduce((sum, e) => sum + calculateEncounterXP(e), 0);

  const copyResults = () => {
    let text = `ENCOUNTER XP SUMMARY\n`;
    text += `${'='.repeat(50)}\n\n`;
    text += `Party Size: ${numPCs} PCs\n\n`;
    
    encounters.forEach((encounter, index) => {
      const baseXP = encounter.monsters.reduce((total, monster) => {
        return total + (MONSTER_XP[monster.cr] * monster.count);
      }, 0);
      const totalMonsters = encounter.monsters.reduce((sum, m) => sum + m.count, 0);
      const multiplier = getEncounterMultiplier(totalMonsters);
      const adjustedXP = calculateEncounterXP(encounter);
      
      if (index > 0) {
        text += `\n`;
      }
      text += `${index + 1}. ${encounter.name}\n`;
      text += `${'-'.repeat(50)}\n`;
      
      encounter.monsters.forEach(monster => {
        const label = monster.name ? `${monster.name} (${monster.cr})` : monster.cr;
        text += `   ${monster.count}x ${label} (${MONSTER_XP[monster.cr]} XP each) = ${(MONSTER_XP[monster.cr] * monster.count).toLocaleString()} XP\n`;
      });
      
      text += `\n   Total Monsters: ${totalMonsters}\n`;
      text += `   Base XP: ${baseXP.toLocaleString()}\n`;
      text += `   Multiplier: x${multiplier}\n`;
      text += `   Adjusted XP: ${adjustedXP.toLocaleString()}\n\n`;
    });
    
    text += `${'='.repeat(50)}\n`;
    text += `TOTAL XP: ${totalXP.toLocaleString()}\n`;
    text += `XP PER PC: ${Math.floor(totalXP / numPCs).toLocaleString()}\n`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  };
  
  const fallbackCopy = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
    document.body.removeChild(textarea);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800 rounded-lg shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-amber-400 mb-2">Encounter XP Tracker</h1>
          <p className="text-slate-300 mb-4 text-sm sm:text-base">Track experience points from multiple combat encounters</p>
          
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-700 p-3 sm:p-4 rounded">
            <label className="text-slate-300 font-semibold text-sm sm:text-base">Number of PCs:</label>
            <input
              type="number"
              min="1"
              max="20"
              value={numPCs}
              onChange={(e) => setNumPCs(parseInt(e.target.value) || 1)}
              className="w-20 px-3 py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-amber-400 focus:outline-none text-base"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="text"
              value={newEncounterName}
              onChange={(e) => setNewEncounterName(e.target.value)}
              placeholder="Encounter name (optional)"
              className="flex-1 px-4 py-3 sm:py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-amber-400 focus:outline-none text-base"
              onKeyPress={(e) => e.key === 'Enter' && addEncounter()}
            />
            <button
              onClick={addEncounter}
              className="px-6 py-3 sm:py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded flex items-center justify-center gap-2 transition-colors text-base"
            >
              <i data-lucide="plus" className="w-5 h-5"></i>
              <span className="sm:inline">Add Encounter</span>
            </button>
          </div>

          {encounters.length > 0 && (
            <div className="bg-slate-700 rounded p-4">
              <div className="text-center mb-3">
                <span className="text-slate-300 text-base sm:text-lg">Total XP: </span>
                <span className="text-amber-400 text-xl sm:text-2xl font-bold">{totalXP.toLocaleString()}</span>
              </div>
              <div className="text-center pt-3 mb-3 border-t border-slate-600">
                <span className="text-slate-300 text-base sm:text-lg">XP per PC: </span>
                <span className="text-green-400 text-xl sm:text-2xl font-bold">{Math.floor(totalXP / numPCs).toLocaleString()}</span>
              </div>
              <button
                onClick={copyResults}
                className="w-full py-3 sm:py-2 bg-slate-600 hover:bg-slate-500 text-amber-400 font-semibold rounded flex items-center justify-center gap-2 transition-colors text-base"
              >
                {copied ? (
                  <>
                    <i data-lucide="check" className="w-5 h-5"></i>
                    Copied!
                  </>
                ) : (
                  <>
                    <i data-lucide="copy" className="w-5 h-5"></i>
                    Copy Results
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {encounters.map((encounter) => (
            <div key={encounter.id} className="bg-slate-800 rounded-lg shadow-lg p-4 sm:p-6">
              <div className="flex justify-between items-start mb-4 gap-2">
                <input
                  type="text"
                  value={encounter.name}
                  onChange={(e) => updateEncounterName(encounter.id, e.target.value)}
                  className="text-lg sm:text-xl font-bold text-amber-400 bg-transparent border-b-2 border-transparent hover:border-amber-400 focus:border-amber-400 focus:outline-none flex-1"
                />
                <button
                  onClick={() => deleteEncounter(encounter.id)}
                  className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0 p-2 -m-2"
                >
                  <i data-lucide="trash-2" className="w-5 h-5"></i>
                </button>
              </div>
              <div className="mb-4">
                <div className="text-slate-400 text-sm space-y-1">
                  <p>Monsters: {encounter.monsters.reduce((sum, m) => sum + m.count, 0)}</p>
                  <p>Base XP: {encounter.monsters.reduce((total, monster) => {
                    return total + (MONSTER_XP[monster.cr] * monster.count);
                  }, 0).toLocaleString()}</p>
                  <p>Multiplier: x{getEncounterMultiplier(encounter.monsters.reduce((sum, m) => sum + m.count, 0))}</p>
                  <p className="text-amber-400 font-semibold">Adjusted XP: {calculateEncounterXP(encounter).toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-3 mb-3">
                {encounter.monsters.map((monster) => (
                  <div key={monster.id} className="bg-slate-700 p-3 rounded">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={monster.name || ''}
                        onChange={(e) => updateMonster(encounter.id, monster.id, 'name', e.target.value)}
                        placeholder="Name (optional)"
                        className="w-full sm:flex-1 px-3 py-2.5 sm:py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-amber-400 focus:outline-none text-base"
                      />
                      <div className="flex gap-2">
                        <select
                          value={monster.cr}
                          onChange={(e) => updateMonster(encounter.id, monster.id, 'cr', e.target.value)}
                          className="flex-1 sm:w-44 px-3 py-2.5 sm:py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-amber-400 focus:outline-none text-base"
                        >
                          {Object.keys(MONSTER_XP).map(cr => (
                            <option key={cr} value={cr}>
                              {cr} ({MONSTER_XP[cr]} XP)
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min="1"
                          value={monster.count}
                          onChange={(e) => updateMonster(encounter.id, monster.id, 'count', parseInt(e.target.value) || 1)}
                          className="w-20 px-3 py-2.5 sm:py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-amber-400 focus:outline-none text-base text-center"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-slate-300 text-sm font-semibold">
                        {(MONSTER_XP[monster.cr] * monster.count).toLocaleString()} XP
                      </span>
                      <button
                        onClick={() => deleteMonster(encounter.id, monster.id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-2 -m-2"
                      >
                        <i data-lucide="x" className="w-5 h-5"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => addMonster(encounter.id)}
                className="w-full py-3 sm:py-2 bg-slate-600 hover:bg-slate-500 text-amber-400 font-semibold rounded flex items-center justify-center gap-2 transition-colors text-base"
              >
                <i data-lucide="plus" className="w-5 h-5"></i>
                Add Entry
              </button>
            </div>
          ))}
        </div>

        {encounters.length === 0 && (
          <div className="text-center text-slate-400 py-12">
            <p className="text-base sm:text-lg">No encounters yet. Create one to start tracking XP!</p>
          </div>
        )}
      </div>
    </div>
  );
}


ReactDOM.render(<XPTracker />, document.getElementById('root'));