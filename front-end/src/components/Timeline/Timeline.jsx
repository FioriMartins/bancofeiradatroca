import { useState } from 'react';
import { Box, TextField, Typography, Button, Divider } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';

import './Timeline.css'

const Timeline = ({ openTimeline, handleCloseTimeline }) => {
    const [entries, setEntries] = useState([]);

    const [newEntry, setNewEntry] = useState({ time: '', name: '' });

    const handleAddEntry = (e) => {
        e.preventDefault();

        if (newEntry.time && newEntry.name) {
            setEntries([newEntry, ...entries]);
            setNewEntry({ time: '', name: '' });
        }
    };

    return (
        <div>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 9999 })}
                open={openTimeline}
                onClick={handleCloseTimeline}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="timeline-content"
                >
                    <Box sx={{ maxWidth: 600, margin: 'auto', marginTop: 2, position: 'relative' }}>
                        {entries.map((entry, index) => (
                            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                                {index > 0 && (
                                    <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '1.8rem', lineHeight: '0', fontWeight: 'bold', color: '#A0A0A0', marginRight: '9px' }}>
                                        &#124;
                                    </Typography>
                                )}

                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body1" sx={{ width: 60, textAlign: 'left' }}>
                                        {entry.time}
                                    </Typography>
                                    <Box
                                        sx={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: '50%',
                                            backgroundColor: '#A0A0A0',
                                            marginRight: 2,
                                            marginTop: '-1px'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 6,
                                                height: 6,
                                                borderRadius: '50%',
                                                backgroundColor: '#f9f9f9',
                                                transform: 'translate(50%, 50%)',
                                            }}
                                        />
                                    </Box>
                                    <Typography variant="body1" sx={{ textAlign: 'left', flexGrow: 1, width: '3.3rem' }}>
                                        {entry.name}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}

                        <Box sx={{ textAlign: 'center', marginLeft: 8, marginTop: 4, marginBottom: 2, display: 'flex', flexDirection: 'row' }}>
                            <form onSubmit={handleAddEntry}>
                                <TextField
                                    label="Horário"
                                    type="time"
                                    value={newEntry.time}
                                    onChange={(e) => setNewEntry({ ...newEntry, time: e.target.value })}
                                    sx={{ marginRight: 2 }}
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        inputMode: 'numeric',
                                    }}
                                />
                                <TextField
                                    label="Nome"
                                    value={newEntry.name}
                                    onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
                                    sx={{ marginRight: 2 }}
                                />
                                <Button
                                    variant="contained"
                                    type="submit"
                                    sx={{ width: 128, height: 56, backgroundColor: 'var(--third-color)' }}
                                >
                                    Adicionar Horário
                                </Button>
                            </form>
                        </Box>
                    </Box>

                </div>
            </Backdrop>
        </div>
    );
};

export default Timeline;