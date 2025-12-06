/**
 * Conversation Scripts for Parents
 * Based on eSafety Commissioner guidance:
 * - https://www.esafety.gov.au/parents/issues-and-advice/hard-to-have-conversations
 * - https://www.esafety.gov.au/parents/issues-and-advice/good-habits-start-young
 */

export interface ConversationScript {
  id: string;
  category: ScriptCategory;
  title: string;
  description: string;
  ageGroup: AgeGroup;
  scripts: string[];
  tips?: string[];
  source: string;
}

export type ScriptCategory =
  | "starting-conversations"
  | "being-curious"
  | "when-things-go-wrong"
  | "building-trust"
  | "digital-kindness"
  | "empathy"
  | "critical-thinking"
  | "safe-behaviour"
  | "resilience"
  | "bullying-concerns"
  | "inappropriate-content"
  | "image-sharing";

export type AgeGroup = "under-8" | "8-12" | "13-18" | "all";

export const SCRIPT_CATEGORIES: Record<ScriptCategory, { label: string; description: string }> = {
  "starting-conversations": {
    label: "Starting the conversation",
    description: "Ways to begin difficult chats with your child"
  },
  "being-curious": {
    label: "Being curious, not interrogating",
    description: "Questions that help you understand without pressuring"
  },
  "when-things-go-wrong": {
    label: "When things go wrong",
    description: "Supportive responses when your child faces online harm"
  },
  "building-trust": {
    label: "Building trust",
    description: "Creating an environment where they feel safe to come to you"
  },
  "digital-kindness": {
    label: "Promoting digital kindness",
    description: "Teaching respectful online communication"
  },
  "empathy": {
    label: "Encouraging empathy",
    description: "Helping them understand others' perspectives"
  },
  "critical-thinking": {
    label: "Teaching critical thinking",
    description: "Questioning what they see online"
  },
  "safe-behaviour": {
    label: "Safe and responsible behaviour",
    description: "Privacy, passwords and personal information"
  },
  "resilience": {
    label: "Building resilience",
    description: "Coping with negative online experiences"
  },
  "bullying-concerns": {
    label: "If your child might be bullying",
    description: "Addressing concerning behaviour with empathy"
  },
  "inappropriate-content": {
    label: "Inappropriate content",
    description: "When they've seen something upsetting"
  },
  "image-sharing": {
    label: "Image sharing concerns",
    description: "Talking about nudes and intimate images"
  }
};

export const CONVERSATION_SCRIPTS: ConversationScript[] = [
  // ==========================================
  // STARTING CONVERSATIONS
  // ==========================================
  {
    id: "start-awkward-topics",
    category: "starting-conversations",
    title: "Opening up awkward topics",
    description: "The hardest part is often deciding where to begin. These openers acknowledge that discomfort.",
    ageGroup: "all",
    scripts: [
      "I want to talk with you about one of those awkward topics. Is that OK?",
      "I don't really know what to say, but I want you to know some information that will help keep you safe online.",
      "I find it really difficult to talk about these topics, but it's important we chat about it.",
      "I read an article today about what kids are seeing online. Can we talk about it?"
    ],
    tips: [
      "If they say no, respect that and set up a time where you can talk later",
      "Chat while doing something else together, like taking a walk or a car trip — it can feel less awkward",
      "Lots of little chats are more effective than one big conversation"
    ],
    source: "https://www.esafety.gov.au/parents/issues-and-advice/hard-to-have-conversations"
  },
  {
    id: "keep-conversation-going",
    category: "starting-conversations",
    title: "Keeping the conversation going",
    description: "Once your child agrees to talk, here are ways to keep things moving.",
    ageGroup: "all",
    scripts: [
      "Have you heard about this? What do you know about it?",
      "Have any of the kids at school talked about this?",
      "Do any of the kids at school ever talk about it? What do they say?",
      "Check if you have any other questions or if I've explained things enough."
    ],
    tips: [
      "Sometimes asking about friends or classmates feels safer than asking about their own behaviour",
      "Let them know that any question is OK to ask — nothing is off limits",
      "If you don't know the answer, tell them you'll help them find out"
    ],
    source: "https://www.esafety.gov.au/parents/issues-and-advice/hard-to-have-conversations"
  },

  // ==========================================
  // BEING CURIOUS
  // ==========================================
  {
    id: "curious-not-interrogating",
    category: "being-curious",
    title: "Asking without interrogating",
    description: "Questions help you understand what your child knows. Balance questions with observations so it doesn't feel like an interrogation.",
    ageGroup: "all",
    scripts: [
      "When you saw that, how did it make you feel?",
      "What do your friends think about that? Do you agree with them?",
      "Have you ever felt uncomfortable about someone contacting you online?",
      "Did someone show it to you, or did you find it yourself?"
    ],
    tips: [
      "Try to find out what you can without getting upset or angry",
      "Reassure them that they are not in trouble",
      "Focus on how they're feeling rather than what they saw"
    ],
    source: "https://www.esafety.gov.au/parents/issues-and-advice/hard-to-have-conversations"
  },
  {
    id: "friends-behaviour",
    category: "being-curious",
    title: "Asking about friends' experiences",
    description: "Sometimes questions about friends feel safer than asking directly about their own behaviour.",
    ageGroup: "8-12",
    scripts: [
      "Have any of the kids at school seen something like this?",
      "Do kids at your school ever talk about things they've seen online?",
      "What do your friends think about that kind of thing?",
      "Has anyone you know ever had something weird happen online?"
    ],
    source: "https://www.esafety.gov.au/parents/issues-and-advice/hard-to-have-conversations"
  },

  // ==========================================
  // WHEN THINGS GO WRONG
  // ==========================================
  {
    id: "reassuring-responses",
    category: "when-things-go-wrong",
    title: "Reassuring responses",
    description: "When your child comes to you about something that's gone wrong, these responses help them feel safe.",
    ageGroup: "all",
    scripts: [
      "I understand what you're saying, and I'm glad you came to me about this. You're not in trouble, we can deal with this together.",
      "What help do you need at the moment? Would you like me to answer some questions or sort out a problem with you?",
      "You might not want to tell me all the detail, but if we can talk honestly about what's happened I promise I'll listen and stay calm.",
      "No matter what happens, we can do this and I will continue to love you."
    ],
    tips: [
      "Stay calm — your reaction affects whether they'll come to you again",
      "Listen and believe them",
      "Plan what to say beforehand so you can respond calmly in the moment"
    ],
    source: "https://www.esafety.gov.au/parents/issues-and-advice/hard-to-have-conversations"
  },
  {
    id: "focus-on-feelings",
    category: "when-things-go-wrong",
    title: "Focus on feelings first",
    description: "For younger children especially, focus on how they're feeling rather than what they saw.",
    ageGroup: "under-8",
    scripts: [
      "How did that make you feel when you saw it?",
      "That sounds like it might have been a bit scary. Is that right?",
      "It's OK to feel confused or uncomfortable about what you saw.",
      "Thank you for telling me. How are you feeling now?"
    ],
    tips: [
      "Children may feel 'yucky', scared, or even violated by inappropriate content",
      "They may also feel curious — try to respond calmly to their curiosity",
      "Your calm response helps them feel comfortable coming to you in future"
    ],
    source: "https://www.esafety.gov.au/parents/issues-and-advice/hard-to-have-conversations"
  },

  // ==========================================
  // BUILDING TRUST
  // ==========================================
  {
    id: "team-of-trusted-adults",
    category: "building-trust",
    title: "Building a support network",
    description: "Your child may find it easier to speak with another trusted adult. Help them build a team of people they can go to.",
    ageGroup: "all",
    scripts: [
      "Who are the adults in your life you feel you could talk to about tricky stuff?",
      "Is there a teacher or family member you'd feel comfortable talking to?",
      "Let's think about who's on your team of trusted adults.",
      "If something ever happened and you didn't want to talk to me, who else could you go to?"
    ],
    tips: [
      "An aunt, uncle, or teacher can sometimes help with difficult conversations",
      "Teachers may be able to suggest helpful resources",
      "Kids Helpline (1800 55 1800) and Parentline are also available"
    ],
    source: "https://www.esafety.gov.au/parents/issues-and-advice/hard-to-have-conversations"
  },
  {
    id: "nothing-off-limits",
    category: "building-trust",
    title: "Any question is OK",
    description: "Let your child know they can ask you anything without judgement.",
    ageGroup: "all",
    scripts: [
      "Any question is OK to ask me — nothing is off limits.",
      "If there's ever something you're wondering about, you can always ask me.",
      "I might not have all the answers, but I'll help you find out.",
      "I'd rather you ask me than try to figure it out on your own."
    ],
    source: "https://www.esafety.gov.au/parents/issues-and-advice/hard-to-have-conversations"
  },

  // ==========================================
  // DIGITAL KINDNESS
  // ==========================================
  {
    id: "respectful-communication",
    category: "digital-kindness",
    title: "Promoting respectful communication",
    description: "Encourage the same positive manners online as offline.",
    ageGroup: "all",
    scripts: [
      "If it's not OK to say or do something face to face, it's not OK online either.",
      "Remember that there's a real person reading your messages, even if you can't see them.",
      "How do you think that message made the other person feel?",
      "It's OK to disagree with someone — what's a kind way to do that online?"
    ],
    tips: [
      "Remind them to avoid responding to negative messages",
      "Tell them it's OK to report others who are not being nice",
      "Emphasise the positives when you see them being kind online"
    ],
    source: "https://www.esafety.gov.au/parents/issues-and-advice/good-habits-start-young"
  },
  {
    id: "praise-kindness",
    category: "digital-kindness",
    title: "Praising positive behaviour",
    description: "Catch them being kind and acknowledge it.",
    ageGroup: "all",
    scripts: [
      "I know what a kind and respectful person you are, and it makes me so proud to see you acting the same way online.",
      "You're such a great friend — I can see how much everyone looks up to you.",
      "I noticed you were really supportive to your friend online today. That was lovely to see.",
      "Thank you for being kind in that group chat. That takes courage."
    ],
    source: "https://www.esafety.gov.au/parents/issues-and-advice/good-habits-start-young"
  },

  // ==========================================
  // EMPATHY
  // ==========================================
  {
    id: "walking-in-others-shoes",
    category: "empathy",
    title: "Walking in someone else's shoes",
    description: "Help your child imagine being in someone else's position.",
    ageGroup: "all",
    scripts: [
      "How do you think that made them feel?",
      "What do you think is going on for that person that might make them act that way?",
      "If that happened to you, how would you want people to respond?",
      "I noticed that your friend seemed a bit sad. What do you think is wrong? What can we do to help?"
    ],
    tips: [
      "Help them relate to diverse opinions and understand different perspectives",
      "Use real examples from their life or yours"
    ],
    source: "https://www.esafety.gov.au/parents/issues-and-advice/good-habits-start-young"
  },

  // ==========================================
  // CRITICAL THINKING
  // ==========================================
  {
    id: "question-what-you-see",
    category: "critical-thinking",
    title: "Teaching them to question",
    description: "Encourage your child to think critically about what they see online.",
    ageGroup: "8-12",
    scripts: [
      "How do we know if this is true or not?",
      "Who do you think made this, and why?",
      "Have you seen other sources that say the same thing?",
      "What questions should we ask before believing this?"
    ],
    tips: [
      "Teach them about 'fake news' and how quickly false information spreads",
      "Show them how to fact check news sources",
      "Encourage independent searches to see different opinions"
    ],
    source: "https://www.esafety.gov.au/parents/issues-and-advice/good-habits-start-young"
  },
  {
    id: "online-friends-caution",
    category: "critical-thinking",
    title: "Being careful with online friends",
    description: "Remind them that people online may not be who they say they are.",
    ageGroup: "all",
    scripts: [
      "How do you know this person is who they say they are?",
      "Have you ever heard of fake accounts? How would you spot one?",
      "If a friend's account suddenly starts acting differently, what might that mean?",
      "What would you do if someone online asked to meet you in person?"
    ],
    tips: [
      "'Finstas' (fake Instagram accounts) and impersonation accounts are increasingly common",
      "If something seems out of character from a friend's account, it could be fake",
      "Never meet an online friend alone — always with a trusted adult, during the day, in a public place"
    ],
    source: "https://www.esafety.gov.au/parents/issues-and-advice/good-habits-start-young"
  },

  // ==========================================
  // SAFE BEHAVIOUR
  // ==========================================
  {
    id: "privacy-settings",
    category: "safe-behaviour",
    title: "Privacy and settings",
    description: "Help them configure strong privacy settings and understand why they matter.",
    ageGroup: "all",
    scripts: [
      "Let's check your privacy settings together — they sometimes change with updates.",
      "Who can see your posts and profile? Is that what you want?",
      "Why do you think apps ask for your location or phone number?",
      "What information do you think is OK to share with people you only know online?"
    ],
    tips: [
      "Check settings regularly as updates can reset them to defaults",
      "Only their circle of friends should be able to view their information or tag them",
      "Help them understand the value of their personal information"
    ],
    source: "https://www.esafety.gov.au/parents/issues-and-advice/good-habits-start-young"
  },
  {
    id: "passwords-security",
    category: "safe-behaviour",
    title: "Passwords and security",
    description: "Teaching the importance of strong, private passwords.",
    ageGroup: "all",
    scripts: [
      "Your password is like the key to your house — who should have a copy?",
      "Why is it important not to share passwords, even with friends?",
      "What makes a password strong? Let's create a good one together.",
      "If you think someone else knows your password, what should you do?"
    ],
    source: "https://www.esafety.gov.au/parents/issues-and-advice/good-habits-start-young"
  },
  {
    id: "suspicious-messages",
    category: "safe-behaviour",
    title: "Suspicious messages and pop-ups",
    description: "Being careful with unsolicited contact.",
    ageGroup: "all",
    scripts: [
      "If someone you don't know sends you a message, what would you do?",
      "Why should we be careful about clicking on pop-up ads?",
      "What would you do if a message asked for personal information?",
      "How can you tell if a message might be a scam?"
    ],
    tips: [
      "Some pop-ups that seem safe can lead to inappropriate sites",
      "Be suspicious of unsolicited messages and emails",
      "Never click links that ask for personal or financial information"
    ],
    source: "https://www.esafety.gov.au/parents/issues-and-advice/good-habits-start-young"
  },

  // ==========================================
  // RESILIENCE
  // ==========================================
  {
    id: "coping-with-negativity",
    category: "resilience",
    title: "Coping with negative experiences",
    description: "Help them navigate difficult situations and build resilience.",
    ageGroup: "all",
    scripts: [
      "What that person did is not OK. They must be feeling pretty bad about themselves to treat you like this.",
      "How are you feeling about it? Let's block them to stop their messages coming through.",
      "Remember, you can choose who you accept as online friends.",
      "Difficult times are part of life, but there's always help and support available."
    ],
    tips: [
      "Keep your cool — your calm response helps them learn",
      "Make sure they know how to block and report users",
      "Build their confidence and encourage positive thinking"
    ],
    source: "https://www.esafety.gov.au/parents/issues-and-advice/good-habits-start-young"
  },

  // ==========================================
  // BULLYING CONCERNS
  // ==========================================
  {
    id: "child-might-be-bullying",
    category: "bullying-concerns",
    title: "If your child might be bullying",
    description: "Addressing concerning behaviour with empathy and guidance.",
    ageGroup: "all",
    scripts: [
      "How do you think it feels to be left out or teased?",
      "If someone treated you that way, how would you feel?",
      "What's going on that's making you feel like you need to act this way?",
      "I've noticed some behaviour I'm worried about. Can we talk about it?"
    ],
    tips: [
      "Help them build empathy — what it might feel like to be the other person",
      "Encourage them to take responsibility and apologise",
      "Talk about accepting differences and how to deal with people that annoy them",
      "Praise any behaviour changes they try to make"
    ],
    source: "https://www.esafety.gov.au/parents/issues-and-advice/good-habits-start-young"
  },
  {
    id: "helping-change-behaviour",
    category: "bullying-concerns",
    title: "Helping them change",
    description: "Strategies for positive behaviour change.",
    ageGroup: "all",
    scripts: [
      "I know you can be better than this. What can we do differently next time?",
      "Let's think about how you can make things right with them.",
      "I've seen how kind you can be. What happened this time?",
      "Everyone makes mistakes. What matters is what we do next."
    ],
    tips: [
      "Identify activities that make them feel good about themselves",
      "Spend one-on-one time together",
      "Practice treating others well at home",
      "Work with their school if needed"
    ],
    source: "https://www.esafety.gov.au/parents/issues-and-advice/good-habits-start-young"
  },

  // ==========================================
  // INAPPROPRIATE CONTENT
  // ==========================================
  {
    id: "seen-inappropriate-content",
    category: "inappropriate-content",
    title: "When they've seen something upsetting",
    description: "Focus on their feelings and provide reassurance.",
    ageGroup: "all",
    scripts: [
      "How are you feeling about what you saw?",
      "Thank you for telling me. You're not in trouble.",
      "It's normal to feel confused or upset by that kind of thing.",
      "What questions do you have? I'll try to help you understand."
    ],
    tips: [
      "Focus on feelings, not on what they saw",
      "Stay calm so they'll come to you again",
      "Answer their questions honestly and age-appropriately"
    ],
    source: "https://www.esafety.gov.au/parents/issues-and-advice/hard-to-have-conversations"
  },
  {
    id: "discussing-explicit-content",
    category: "inappropriate-content",
    title: "Discussing explicit content",
    description: "For when more direct conversations are needed.",
    ageGroup: "13-18",
    scripts: [
      "The most important thing to know about what you might see online is that it's not real life.",
      "What you see online often sends unhealthy messages about relationships and consent.",
      "Have you talked about this with your friends? What do they think?",
      "What questions do you have about healthy relationships?"
    ],
    tips: [
      "Link to broader conversations about consent and respectful relationships",
      "Talk about trusted sources of information",
      "This can be an opportunity to discuss realistic expectations"
    ],
    source: "https://www.esafety.gov.au/parents/issues-and-advice/hard-to-have-conversations"
  },

  // ==========================================
  // IMAGE SHARING
  // ==========================================
  {
    id: "asked-to-share-images",
    category: "image-sharing",
    title: "If they've been asked to share images",
    description: "Responding when someone has asked them for intimate images.",
    ageGroup: "13-18",
    scripts: [
      "Has anyone ever asked you to send a photo you weren't comfortable with?",
      "What would you do if someone asked you to send a nude?",
      "How did that make you feel when they asked?",
      "You never have to do anything that makes you uncomfortable. What happened next?"
    ],
    tips: [
      "Reassure them they're not in trouble",
      "Find out what happened without getting upset",
      "Discuss their feelings about the situation"
    ],
    source: "https://www.esafety.gov.au/parents/issues-and-advice/hard-to-have-conversations"
  },
  {
    id: "shared-someone-elses-image",
    category: "image-sharing",
    title: "If they've shared someone else's image",
    description: "Addressing the situation when they've shared an intimate image without consent.",
    ageGroup: "13-18",
    scripts: [
      "I need to talk to you about something serious. I'm not going to get angry, but we need to sort this out.",
      "Can you help me understand what happened?",
      "How do you think the person in the image feels about this?",
      "Let's work out how we can stop this image being shared further and how to make things right."
    ],
    tips: [
      "Try to get the full story",
      "Explain why it's a problem",
      "Work to stop the image being further shared",
      "Help your child repair any harm caused"
    ],
    source: "https://www.esafety.gov.au/parents/issues-and-advice/good-habits-start-young"
  }
];

// eSafety resource links
export const ESAFETY_RESOURCES = [
  {
    title: "The hard-to-have conversations",
    url: "https://www.esafety.gov.au/parents/issues-and-advice/hard-to-have-conversations",
    description: "Tips for starting difficult conversations about online safety"
  },
  {
    title: "Good habits start young",
    url: "https://www.esafety.gov.au/parents/issues-and-advice/good-habits-start-young",
    description: "Building digital intelligence from an early age"
  },
  {
    title: "Online safety basics",
    url: "https://www.esafety.gov.au/parents/issues-and-advice/online-safety-basics",
    description: "Fundamental online safety guidance for parents"
  },
  {
    title: "Kids Helpline",
    url: "https://kidshelpline.com.au/",
    description: "1800 55 1800 — Free, private and confidential phone and online counselling"
  },
  {
    title: "Parentline",
    url: "https://www.parentline.com.au/",
    description: "Support for parents and carers across Australia"
  }
];

// Helper functions
export function getScriptsByCategory(category: ScriptCategory): ConversationScript[] {
  return CONVERSATION_SCRIPTS.filter(script => script.category === category);
}

export function getScriptsByAgeGroup(ageGroup: AgeGroup): ConversationScript[] {
  return CONVERSATION_SCRIPTS.filter(
    script => script.ageGroup === ageGroup || script.ageGroup === "all"
  );
}

export function getScriptById(id: string): ConversationScript | undefined {
  return CONVERSATION_SCRIPTS.find(script => script.id === id);
}

export function getAllCategories(): ScriptCategory[] {
  return Object.keys(SCRIPT_CATEGORIES) as ScriptCategory[];
}
