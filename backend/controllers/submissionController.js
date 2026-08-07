const Submission = require('../models/submission.model');
const Audio = require('../models/audio.model');
const Mezmur = require('../models/mezmur.model');
const { sendMessage } = require('../services/telegramIngest');
const BotSession = require('../models/botSession.model');

exports.listSubmissions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const status = req.query.status || null;
        
        const result = await Submission.findAll(page, limit, status);
        res.json({ ok: true, ...result });
    } catch (err) {
        console.error('[submissionController] list error:', err);
        res.status(500).json({ ok: false, error: 'Failed to list submissions' });
    }
};

exports.approveSubmission = async (req, res) => {
    try {
        const id = req.params.id;
        const submission = await Submission.findById(id);
        
        if (!submission) {
            return res.status(404).json({ ok: false, error: 'Submission not found' });
        }
        if (submission.status === 'approved') {
            return res.status(400).json({ ok: false, error: 'Already approved' });
        }

        const aiMeta = typeof submission.ai_metadata === 'string' 
            ? JSON.parse(submission.ai_metadata) 
            : (submission.ai_metadata || {});
            
        // For now, assign to category ID 1 (default) or attempt to match category name.
        // In a real scenario, Admin Panel might send category_id in the body.
        const category_id = req.body.category_id || 1;
        const language = aiMeta.metadata?.language || 'am';
        const title = req.body.title || aiMeta.title || 'Untitled Mezmur';
        
        const mezmurData = {
            category_id,
            title,
            content: req.body.lyrics || submission.lyrics || aiMeta.formatted_lyrics || '',
            language,
            audio_url: submission.m4a_audio, // Fallback for old apps
            sort_order: 0
        };
        
        // 1. Create or Update Mezmur
        let targetMezmurId;
        if (submission.duplicate_of) {
            const originalMezmur = await Mezmur.findById(submission.duplicate_of);
            if (originalMezmur) {
                const updatedData = {
                    category_id: req.body.category_id || originalMezmur.category_id,
                    title: req.body.title || (submission.lyrics ? title : originalMezmur.title),
                    content: req.body.lyrics || (submission.lyrics ? mezmurData.content : originalMezmur.content),
                    language: originalMezmur.language,
                    audio_url: submission.m4a_audio || originalMezmur.audio_url,
                    sort_order: originalMezmur.sort_order
                };
                await Mezmur.update(submission.duplicate_of, updatedData);
                targetMezmurId = submission.duplicate_of;
            } else {
                const createdMezmur = await Mezmur.create(mezmurData);
                targetMezmurId = createdMezmur.id;
            }
        } else {
            const createdMezmur = await Mezmur.create(mezmurData);
            targetMezmurId = createdMezmur.id;
        }
        
        // 2. Create Audio record if audio exists
        if (submission.opus_audio || submission.m4a_audio) {
            await Audio.create({
                mezmur_id: targetMezmurId,
                opus_path: submission.opus_audio,
                m4a_path: submission.m4a_audio,
                // These could be stored in a JSON payload during conversion if needed
                duration: 0, 
                sizes: {}
            });
        }
        
        // 3. Mark approved
        await Submission.updateStatus(id, 'approved');
        
        // 4. Notify user
        if (submission.telegram_user_id) {
            try {
                const session = await BotSession.getSession(submission.telegram_user_id);
                const isAmharic = session.language === 'am';
                const msg = isAmharic 
                    ? `መልካም ዜና! የላኩት መዝሙር ("${title}") ጸድቆ ወደ አፑ ገብቷል። እናመሰግናለን!`
                    : `Good news! Your submitted Mezmur ("${title}") has been approved and published to the app. Thank you!`;
                await sendMessage(submission.telegram_user_id, msg, {}, true);
            } catch (e) {
                console.error('Failed to send approval notification', e);
            }
        }

        res.json({ ok: true, message: 'Submission approved and published', mezmurId: targetMezmurId });
    } catch (err) {
        console.error('[submissionController] approve error:', err);
        res.status(500).json({ ok: false, error: 'Failed to approve submission' });
    }
};

exports.rejectSubmission = async (req, res) => {
    try {
        const id = req.params.id;
        const submission = await Submission.findById(id);
        
        if (!submission) {
            return res.status(404).json({ ok: false, error: 'Submission not found' });
        }

        await Submission.updateStatus(id, 'rejected');

        // Notify user
        if (submission.telegram_user_id) {
            try {
                const session = await BotSession.getSession(submission.telegram_user_id);
                const aiMeta = typeof submission.ai_metadata === 'string' 
                    ? JSON.parse(submission.ai_metadata) 
                    : (submission.ai_metadata || {});
                const title = aiMeta.title || 'Untitled Mezmur';
                const isAmharic = session.language === 'am';
                const msg = isAmharic 
                    ? `ይቅርታ፣ የላኩት መዝሙር ("${title}") ተቀባይነት አላገኘም።`
                    : `Sorry, your Mezmur submission ("${title}") was rejected.`;
                await sendMessage(submission.telegram_user_id, msg, {}, true);
            } catch (e) {
                console.error('Failed to send rejection notification', e);
            }
        }

        res.json({ ok: true, message: 'Submission rejected' });
    } catch (err) {
        console.error('[submissionController] reject error:', err);
        res.status(500).json({ ok: false, error: 'Failed to reject submission' });
    }
};
