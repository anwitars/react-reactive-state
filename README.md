# Reactive State

Small React library to easily manage more complex state in your components without using Reducers.

## Example

```jsx
import React from 'react';
import { useReactiveState } from 'reactive-state';

const toSnakeCase = (str) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const YourComponent = () => {
    const state = useReactiveState({
        username: "",
        password: "",
        rememberMe: false
        // more state here...
    });

    const submit = async () => {
        const payload = Object.keys(state.getValues()).reduce((acc, key) => {
            acc[toSnakeCase(key)] = state[key];
            return acc;
        }, {});

        const response = await fetch('https://your-api.com/login', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        // ...
    }

    return (
        <div>
            <input
                type="text"
                value={state.username}
                onChange={(e) => state.setUsername(e.target.value)}
            />
            <input
                type="password"
                value={state.password}
                onChange={(e) => state.setPassword(e.target.value)}
            />
            <input
                type="checkbox"
                checked={state.rememberMe}
                onChange={(e) => state.setRememberMe(e.target.checked)}
            />
        </div>
    );
}
```

