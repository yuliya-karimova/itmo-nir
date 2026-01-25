import React from 'react';

function FormBlock({ block }) {
  const [formData, setFormData] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Очищаем ошибку для этого поля
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    block.fields.forEach(field => {
      const value = formData[field.name];
      
      if (field.required && !value) {
        newErrors[field.name] = `Поле "${field.label}" обязательно для заполнения`;
      } else if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors[field.name] = 'Введите корректный email';
      } else if (field.type === 'tel' && value && !/^[\d\s\-\+\(\)]+$/.test(value)) {
        newErrors[field.name] = 'Введите корректный номер телефона';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Здесь можно добавить отправку данных на сервер
      console.log('Form data:', formData);
      setSubmitted(true);
      // Можно сбросить форму через несколько секунд
      setTimeout(() => {
        setFormData({});
        setSubmitted(false);
      }, 3000);
    }
  };

  const renderField = (field) => {
    const fieldId = `field-${field.name}`;
    const hasError = errors[field.name];
    const value = formData[field.name] || '';

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.name} className="form-field">
            <label htmlFor={fieldId}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <textarea
              id={fieldId}
              name={field.name}
              value={value}
              onChange={handleChange}
              required={field.required}
              className={hasError ? 'error' : ''}
              rows={4}
            />
            {hasError && <span className="error-message">{errors[field.name]}</span>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className="form-field checkbox-field">
            <label htmlFor={fieldId} className="checkbox-label">
              <input
                id={fieldId}
                name={field.name}
                type="checkbox"
                checked={formData[field.name] || false}
                onChange={handleChange}
                required={field.required}
                className={hasError ? 'error' : ''}
              />
              <span>
                {field.label}
                {field.required && <span className="required">*</span>}
              </span>
            </label>
            {hasError && <span className="error-message">{errors[field.name]}</span>}
          </div>
        );

      default:
        return (
          <div key={field.name} className="form-field">
            <label htmlFor={fieldId}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              id={fieldId}
              name={field.name}
              type={field.type || 'text'}
              value={value}
              onChange={handleChange}
              required={field.required}
              className={hasError ? 'error' : ''}
            />
            {hasError && <span className="error-message">{errors[field.name]}</span>}
          </div>
        );
    }
  };

  if (submitted) {
    return (
      <section className="block form-block">
        <div className="container">
          {block.title && <h2>{block.title}</h2>}
          <div className="form-success">
            <p>Спасибо! Ваша форма успешно отправлена.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="block form-block">
      <div className="container">
        {block.title && <h2>{block.title}</h2>}
        {block.description && (
          <div className="form-description">
            {block.description.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit} className="form">
          {block.fields && block.fields.map(renderField)}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {block.submitText || 'Отправить'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default FormBlock;
