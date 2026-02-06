/**
 * DUMMY DATA FOR FRONTEND DEVELOPMENT
 * This file replaces backend API calls for now.
 */

export const USERS = [
    {
        id: 'u1',
        username: 'mindful_sarah',
        email: 'sarah@example.com',
        avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=Sarah',
        role: 'user',
        bio: 'Finding peace in the chaos. Anxiety survivor.',
        joinedAt: '2023-01-15T10:00:00Z',
    },
    {
        id: 'u2',
        username: 'meditation_guru',
        email: 'guru@example.com',
        avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=Guru',
        role: 'admin',
        bio: 'Here to help you breathe.',
        joinedAt: '2023-01-10T10:00:00Z',
    },
    {
        id: 'u3',
        username: 'new_hope',
        email: 'hope@example.com',
        avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=Hope',
        role: 'user',
        bio: 'Just starting my journey.',
        joinedAt: '2023-03-20T10:00:00Z',
    }
];

export const CURRENT_USER = USERS[0]; // Simulating logged-in user

export const ARTICLES = [
    {
        id: 'a1',
        title: 'How I learned to cope with social anxiety',
        content: 'It started when I was in high school... (full content would go here). I learned that breathing exercises and exposure therapy really help. taking small steps is key.',
        preview: 'It started when I was in high school... I learned that breathing exercises and exposure therapy really help.',
        author: USERS[0],
        likes: 24,
        comments: 5,
        createdAt: '2023-10-25T09:30:00Z',
        tags: ['Anxiety', 'Personal Story'],
    },
    {
        id: 'a2',
        title: '5 Daily Habits for Better Mental Health',
        content: '1. Drink water. 2. Meditate. 3. Walk outside. 4. Journal. 5. Sleep well.',
        preview: '1. Drink water. 2. Meditate. 3. Walk outside. 4. Journal. 5. Sleep well.',
        author: USERS[1],
        likes: 156,
        comments: 42,
        createdAt: '2023-10-24T14:15:00Z',
        tags: ['Tips', 'Wellness'],
    },
    {
        id: 'a3',
        title: 'Feeling overwhelmed? Read this.',
        content: 'You are not alone. Everyone feels this way sometimes. Take a deep breath.',
        preview: 'You are not alone. Everyone feels this way sometimes. Take a deep breath.',
        author: USERS[1],
        likes: 89,
        comments: 12,
        createdAt: '2023-10-23T18:45:00Z',
        tags: ['Support', 'Stress'],
    }
];

export const GROUPS = [
    {
        id: 'g1',
        name: 'Anxiety Support',
        description: 'A safe space to share experiences and coping strategies for anxiety.',
        memberCount: 1240,
        isJoined: true,
        admin: USERS[1],
    },
    {
        id: 'g2',
        name: 'Depression Fighters',
        description: 'We fight together. You are not alone in this battle.',
        memberCount: 850,
        isJoined: false,
        admin: USERS[1],
    },
    {
        id: 'g3',
        name: 'Mindfulness & Meditation',
        description: 'Daily prompts and discussions about mindfulness practices.',
        memberCount: 3200,
        isJoined: false,
        admin: USERS[0],
    }
];

export const GROUP_DETAILS = {
    g1: {
        ...GROUPS[0],
        members: [USERS[0], USERS[1], USERS[2]],
        joinRequests: [USERS[2]], // Simulating a pending request
        posts: [
            { id: 'gp1', author: USERS[2], content: 'Does anyone else feel dizzy when anxious?', likes: 5, comments: 2, createdAt: '2023-10-26T10:00:00Z' }
        ]
    }
};
