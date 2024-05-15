import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './SkillForm.css'; // For custom styles



const SkillForm = () => {

  const { '*': wildcard } = useParams(); 
  const [skills, setSkills] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [initialSkills,setInitialSkills] = useState([])

  // useEffect on page load
    useEffect(() => {
      // Get all skills currently on User
      fetch(`http://localhost:5002/users/${wildcard}`)
      .then(response => response.json())
      .then(data => {
        setSkills(data[0].skills);
      })
      .catch(error => {
        console.error('Error fetching skills:', error);
      });

      // Get all skills from the database for suggestions
      fetch('http://localhost:5002/skills')
      .then(response => response.json())
      .then(data => {
        data.forEach(skill => {
          setInitialSkills(prev => [...prev, skill.name])
        })
      })
      .catch(error => {
        console.error('Error fetching skills:', error);
      });

    },[])

  // useEffect on skills change to update user
  useEffect(() => { 
    fetch(`http://localhost:5002/users/${wildcard}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({skills})
    })
    // .then(response => response.json())
    // .then(data => {
    //   // console.log(skills)
    //   // console.log('Successfully Updated:', data);
    // })
    .catch(error => {
      console.error('Error updating user:', error);
    });
  },[skills, wildcard])

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
    fetch(`http://localhost:5002/users/${wildcard}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({skills})
    })
    .then(console.log(skills))
    // .then(data => {
    //   // console.log(skills)
    //   // console.log('Successfully Updated:', data);
    // })
    .catch(error => {
      console.error('Error updating user:', error);
    });
    
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue) {
        if (!skills.includes(inputValue)) {
          setSkills([...skills, inputValue]);
        }
        setInputValue('');
        setSuggestions([]);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Skills:', skills);
    setSkills([]);
    setInputValue('');
  };

  return (
    <form onSubmit={handleSubmit}>
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