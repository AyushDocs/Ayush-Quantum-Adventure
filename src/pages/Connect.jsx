import { useState } from 'react';

export default function Connect() {
    const [status, setStatus] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        
        // This is a placeholder for Formspree or any static form service.
        // User needs to register and put their hash here.
        // For demonstration I'll wrap it in a mock fetch or direct to real logic if ID known.
        // I will set action to a generic placeholder.
        const data = new FormData(form);
        const action = form.action;
        
        setStatus("Sending...");

        try {
            const response = await fetch(action, {
                method: form.method,
                body: data,
                headers: {
                  'Accept': 'application/json'
                }
            });
            if (response.ok) {
                setStatus("Message sent. I'll get back to you.");
                form.reset();
            } else {
                 const data = await response.json();
                 if (Object.hasOwn(data, 'errors')) {
                    setStatus(data["errors"].map(error => error["message"]).join(", "));
                 } else {
                    setStatus("Oops! There was a problem submitting your form");
                 }
            }
        } catch (error) {
            setStatus("Error sending message.");
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px', margin: '4rem auto' }}>
             <h1 style={{ 
                fontSize: '2rem', 
                marginBottom: '1rem', 
                color: 'var(--text-color)'
            }}>
                Connect
            </h1>
            <p style={{ color: '#aaa', marginBottom: '2rem', lineHeight: '1.6' }}>
                If you have questions about the models or want to discuss system design in physics, drop a message.
            </p>

            <form 
                // REPLACE {FORM_ID} WITH YOUR FORMSPREE ID
                action="https://formspree.io/f/{FORM_ID}" 
                method="POST"
                onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Name</label>
                    <input 
                        type="text" name="name" required
                        style={{ 
                            width: '100%', padding: '10px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', 
                            color: 'var(--text-color)', borderRadius: '4px' 
                        }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email</label>
                    <input 
                        type="email" name="email" required
                        style={{ 
                            width: '100%', padding: '10px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', 
                            color: 'var(--text-color)', borderRadius: '4px' 
                        }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Message</label>
                    <textarea 
                        name="message" rows="5" required
                        style={{ 
                            width: '100%', padding: '10px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', 
                            color: 'var(--text-color)', borderRadius: '4px', fontFamily: 'inherit' 
                        }}
                    ></textarea>
                </div>

                <button type="submit" className="btn" style={{ 
                    alignSelf: 'flex-start', padding: '10px 30px', background: 'var(--accent-color)', color: '#000', border:'none' 
                }}>
                    Send
                </button>

                {status && <p style={{ marginTop: '1rem', color: status.includes('sent') ? '#4caf50' : '#f44336' }}>{status}</p>}
            </form>
            
            <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#666' }}>
                Note: This form requires a backend service configuration (e.g., Formspree).
            </p>
        </div>
    );
}
