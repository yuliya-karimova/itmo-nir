import React from 'react';

// Классический подход: форма полностью захардкожена на фронтенде
function ContactForm() {
  // Поля формы жестко закодированы здесь
  const fields = [
    { name: 'name', label: 'Имя', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Телефон', type: 'tel', required: false },
    { name: 'message', label: 'Сообщение', type: 'textarea', required: true },
    { name: 'agree', label: 'Согласие на обработку персональных данных', type: 'checkbox', required: true }
  ];

  const [formData, setFormData] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    const initialData = {};
    fields.forEach(field => {
      initialData[field.name] = field.type === 'checkbox' ? false : '';
    });
    setFormData(initialData);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {};
    
    fields.forEach(field => {
      const value = formData[field.name];
      
      if (field.required) {
        if (field.type === 'checkbox' && !value) {
          newErrors[field.name] = `${field.label} обязательно для согласия`;
          isValid = false;
        } else if (value === '' || value === null || value === undefined) {
          newErrors[field.name] = `${field.label} обязательно для заполнения`;
          isValid = false;
        }
      }
      
      if (field.type === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
        newErrors[field.name] = 'Введите корректный Email';
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form data:', formData);
      // Здесь можно отправить данные на сервер
      setSubmitted(true);
    } else {
      console.log('Validation errors:', errors);
    }
  };

  if (submitted) {
    return (
      <section className="section form-section">
        <div className="container">
          <div className="form-success">
            <h2>Спасибо за ваше сообщение!</h2>
            <p>Мы свяжемся с вами в ближайшее время.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section form-section">
      <div className="container">
        <h2>Свяжитесь с нами</h2>
        <div className="form-description">
          <p>Заполните форму ниже, и мы обязательно ответим вам.</p>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          {fields.map(field => (
            <div key={field.name} className="form-field">
              {field.type !== 'checkbox' && (
                <label htmlFor={field.name}>
                  {field.label}
                  {field.required && <span className="required">*</span>}
                </label>
              )}
              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  className={errors[field.name] ? 'error' : ''}
                  rows={4}
                />
              ) : field.type === 'checkbox' ? (
                <div className="checkbox-field">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      id={field.name}
                      name={field.name}
                      checked={formData[field.name] || false}
                      onChange={handleChange}
                      className={errors[field.name] ? 'error' : ''}
                    />
                    {field.label}
                    {field.required && <span className="required">*</span>}
                  </label>
                </div>
              ) : (
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  className={errors[field.name] ? 'error' : ''}
                />
              )}
              {errors[field.name] && <span className="error-message">{errors[field.name]}</span>}
            </div>
          ))}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Отправить
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default ContactForm;
