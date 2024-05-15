import React, { useState, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import './SkillForm.css'; // For custom styles

const SkillForm = () => {
  const { '*': wildcard } = useParams(); 
  const [skills, setSkills] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [initialSkills, setInitialSkills] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const navigate = useNavigate();

  // Fetch user skills on page load
  useEffect(() => {
    fetch(`/users/${wildcard}`)
      .then(response => response.json())
      .then(data => {
        if (data.length === 0) {
          fetch('/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: wildcard })
          })
          .then(() => {
            // Update the allUsers state to reflect the changes locally
            setAllUsers(prevUsers => [...prevUsers, { name: wildcard, skills: [] }]);
          })
          .catch(error => {
            console.error('Error creating user:', error);
          });
        } else {
          setSkills(data[0].skills);
        }
      })
      .catch(error => {
        console.error('Error fetching skills:', error);
      });

    fetch('/skills')
      .then(response => response.json())
      .then(data => {
        const skillNames = data.map(skill => skill.name);
        setInitialSkills(skillNames);
      })
      .catch(error => {
        console.error('Error fetching skills:', error);
      });
  }, [wildcard]);

  // Fetch all users on page load (no dependencies to prevent unnecessary re-fetches)
  useEffect(() => {
    fetch('/users')
      .then(response => response.json())
      .then(data => {
        setAllUsers(data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  // Update user skills in the database when skills change
  useEffect(() => {
    if (skills.length || skills.length === 0) {
      fetch(`/users/${wildcard}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ skills })
      })
      .catch(error => {
        console.error('Error updating user:', error);
      });
    }
  }, [skills, wildcard]);

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
      const updatedSkills = [...skills, skill];
      setSkills(updatedSkills);
  
      fetch(`/users/${wildcard}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ skills: updatedSkills })
      })
      .then(() => {
        // Update the allUsers state to reflect the changes locally
        setAllUsers(prevUsers => prevUsers.map(user => 
          user.name === wildcard ? { ...user, skills: updatedSkills } : user
        ));
      })
      .catch(error => {
        console.error('Error updating user:', error);
      });

      // Add the skill to the skills collection if it doesn't already exist
      if (!initialSkills.includes(skill)) {
        fetch('/skills', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: skill })
        })
        .then(() => {
          setInitialSkills([...initialSkills, skill]);
        })
        .catch(error => {
          console.error('Error adding skill to skills collection:', error);
        });
      }
    }
    setInputValue('');
    setSuggestions([]);
  };

  const handleSkillRemove = (skillToRemove) => {
    const updatedSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(updatedSkills);

    fetch(`/users/${wildcard}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ skills: updatedSkills })
    })
    .then(() => {
      // Update the allUsers state to reflect the changes locally
      setAllUsers(prevUsers => prevUsers.map(user => 
        user.name === wildcard ? { ...user, skills: updatedSkills } : user
      ));
    })
    .catch(error => {
      console.error('Error updating user:', error);
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue && !skills.includes(inputValue)) {
        const updatedSkills = [...skills, inputValue];
        setSkills(updatedSkills);
  
        fetch(`/users/${wildcard}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ skills: updatedSkills })
        })
        .then(() => {
          // Update the allUsers state to reflect the changes locally
          setAllUsers(prevUsers => prevUsers.map(user => 
            user.name === wildcard ? { ...user, skills: updatedSkills } : user
          ));
        })
        .catch(error => {
          console.error('Error updating user:', error);
        });

        // Add the skill to the skills collection if it doesn't already exist
        if (!initialSkills.includes(inputValue)) {
          fetch('/skills', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: inputValue })
          })
          .then(() => {
            setInitialSkills([...initialSkills, inputValue]);
          })
          .catch(error => {
            console.error('Error adding skill to skills collection:', error);
          });
        }
  
        setInputValue('');
        setSuggestions([]);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Skills:', skills);
  };

  const handleLogout = () => {
    navigate('/');
  }

  return (
    <div className="container">
      <div className="header">
        <button className='logout' onClick={handleLogout}>Logout</button>
      </div>
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
      {allUsers.map((user, index) => (
        <div key={index} className="user">
          <h3>{user.name}</h3>
          <p>Skills: {user.skills.join(', ')}</p>
        </div>
      ))}
    </div>
  );
};

export default SkillForm;