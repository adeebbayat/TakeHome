import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './SkillForm.css'; // For custom styles

const initialSkills = [
  'ACC', 'Accent', 'Ace DASL', 'ACL2', 'ACT-III', 'Action!', 'ActionScript', 
  'Active Server Pages', 'Caché ObjectScript', 'Machine code', 'Maxima (see also Macsyma)'
  // Add more initial skills as needed
];

const SkillForm = () => {
  // const [name, setName] = useState('');
  const { '*': wildcard } = useParams(); 
  const [skills, setSkills] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [initialSkills,setInitialSkills] = useState([])
  // const handleNameChange = (e) => {
  //   setName(e.target.value);
  // }

  useEffect(() => {

    fetch(`http://localhost:3001/users/${wildcard}`)
    .then(response => {
      response.json()
    })
    .then(data => {
      console.log('Successfully Created:', data);
    })
    .catch(error => {
      console.error('Error creating skill:', error);
    });

  })

  useEffect(() => {
    fetch('http://localhost:3001/skills')
      .then(response => response.json())
      .then(data => {
        const dataArray = [];
        data.forEach((element) => dataArray.push(element.name))
        setInitialSkills(dataArray)
      })
      .catch(error => console.error('Error fetching skills:', error));
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value) {
      const filteredSuggestions = initialSkills.filter(skill =>
        skill.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSkillClick = (skill) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
    setInputValue('');
    setSuggestions([]);
  };

  const handleSkillRemove = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue) {
        if (!skills.includes(inputValue)) {
          setSkills([...skills, inputValue]);
        }
        
        fetch('http://localhost:3001/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name:inputValue})
        
      })
      .then(response => {
        response.json()
      })
      .then(data => {
        console.log('Successfully Created:', data);
      })
      .catch(error => {
        console.error('Error creating skill:', error);
      });

        setInputValue('');
        setSuggestions([]);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Name:', name);
    console.log('Skills:', skills);
    setName('');
    setSkills([]);
    setInputValue('');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleNameChange}
          required
        />
      </div> */}
      <div className="form-group">
        <label htmlFor="skills">Skills:</label>
        <div className="skills-input-container">
          <div className="selected-skills">
            {skills.map((skill, index) => (
              <span key={index} className="skill-badge">
                {skill} <button type="button" onClick={() => handleSkillRemove(skill)}>x</button>
              </span>
            ))}
          </div>
          <input
            type="text"
            id="skills"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter skills"
          />
          {suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSkillClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default SkillForm;
