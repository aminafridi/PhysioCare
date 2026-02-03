export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  imageUrl?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: '2',
    title: 'Exercises for Knee Recovery',
    slug: 'exercises-for-knee-recovery',
    excerpt: 'A comprehensive guide to exercises that aid in knee injury recovery and strengthen your joints.',
    content: `
      <p>Recovering from a knee injury requires patience and the right exercises. Here's a guide to help you regain strength and mobility in your knee.</p>
      
      <h3>1. Straight Leg Raises</h3>
      <p>Lie on your back with one leg bent. Keeping the other leg straight, lift it to the height of your bent knee. This strengthens your quadriceps without stressing your knee.</p>
      
      <h3>2. Hamstring Curls</h3>
      <p>Stand behind a chair for support. Slowly bend one knee, bringing your heel toward your buttock. This exercise strengthens the muscles at the back of your thigh.</p>
      
      <h3>3. Wall Squats</h3>
      <p>Stand with your back against a wall. Slowly slide down until your knees are bent at about 30 degrees. Hold for 5-10 seconds and return to standing.</p>
      
      <h3>4. Step-Ups</h3>
      <p>Using a step or sturdy platform, step up with one foot, then the other. Step down in the same order. This improves strength and coordination.</p>
    `,
    author: 'Dr. Emily Chen',
    date: '2024-01-20',
    readTime: '6 min read',
    category: 'Exercises',
    imageUrl: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=800&auto=format&fit=crop', // Knee/Exercise
  },
  {
    id: '3',
    title: 'Benefits of Physiotherapy After Surgery',
    slug: 'benefits-physiotherapy-after-surgery',
    excerpt: 'Discover why physiotherapy is crucial for optimal recovery after surgical procedures.',
    content: `
      <p>Physiotherapy plays a vital role in post-surgical recovery. Here's why you should consider physiotherapy as part of your recovery plan.</p>
      
      <h3>1. Faster Recovery</h3>
      <p>Studies show that patients who undergo physiotherapy after surgery recover faster than those who don't. Targeted exercises help restore function more quickly.</p>
      
      <h3>2. Reduced Pain</h3>
      <p>Physiotherapy techniques such as manual therapy and specific exercises can help reduce post-surgical pain and decrease reliance on pain medication.</p>
      
      <h3>3. Prevented Complications</h3>
      <p>Movement and exercise help prevent complications like blood clots, muscle atrophy, and joint stiffness that can occur after surgery.</p>
      
      <h3>4. Restored Strength and Mobility</h3>
      <p>A structured physiotherapy program helps rebuild strength and restore full range of motion in the affected area.</p>
      
      <h3>5. Improved Long-Term Outcomes</h3>
      <p>Patients who complete their physiotherapy program have better long-term outcomes and are less likely to require additional surgeries.</p>
    `,
    author: 'Dr. John Smith',
    date: '2024-01-25',
    readTime: '7 min read',
    category: 'Recovery',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop', // Med/Recovery
  },
  {
    id: '5',
    title: 'The Role of Hydration in Muscle Recovery',
    slug: 'role-hydration-muscle-recovery',
    excerpt: 'Why staying hydrated is just as important as the workout itself for your muscle health.',
    content: `
      <p>Water is essential for every metabolic function in body, including muscle contraction and repair. Here is why hydration matters so much for recovery.</p>
      
      <h3>1. Nutrient Transport</h3>
      <p>Water carries oxygen and nutrients to your muscles, which they need to repair themselves after a tough workout.</p>
      
      <h3>2. Waste Removal</h3>
      <p>Hydration flushes out metabolic waste products formed during intensive exercise, reducing soreness and stiffness.</p>
      
      <h3>3. Temperature Regulation</h3>
      <p>Sweating helps regulate body temperature, but it also causes fluid loss. Replenishing these fluids prevents cramping and fatigue.</p>
      
      <h3>4. Prevention of Cramps</h3>
      <p>Dehydration is a leading cause of muscle cramps. Maintaining fluid balance keeps your electrolytes stable and muscles functioning smoothly.</p>
    `,
    author: 'Dr. Sarah Johnson',
    date: '2024-02-05',
    readTime: '4 min read',
    category: 'Wellness',
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=800&auto=format&fit=crop', // Water/Hydration
  }
];
